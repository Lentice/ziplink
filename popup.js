// popup.js — Ziplink popup logic (ES module)
import { services, getService } from './services/registry.js';

// ── DOM refs ──────────────────────────────────────────────────────────────────
const btnShorten     = document.getElementById('btn-shorten');
const resultArea     = document.getElementById('result-area');
const controlsRow    = document.getElementById('controls-row');
const pillsContainer = document.getElementById('pills-container');
const toggleAuto     = document.getElementById('toggle-autocopy');

// ── State ─────────────────────────────────────────────────────────────────────
let selectedService = services[0].id;
let autoCopy        = true;

// ── Pills init ────────────────────────────────────────────────────────────────
function initPills() {
  const map = new Map();
  for (const svc of services) {
    const btn = document.createElement('button');
    btn.className = 'pill';
    btn.dataset.service = svc.id;
    btn.type = 'button';
    btn.textContent = svc.name;
    btn.addEventListener('click', () => {
      if (svc.id === selectedService) return;
      selectedService = svc.id;
      applyPillSelection(selectedService);
      chrome.storage.sync.set({ selectedService });
      setStateIdle();
    });
    pillsContainer.appendChild(btn);
    map.set(svc.id, btn);
  }
  return map;
}

const pillMap = initPills();

// ── Pill selection ────────────────────────────────────────────────────────────
function applyPillSelection(serviceId) {
  for (const [id, btn] of pillMap) {
    btn.classList.toggle('pill-selected', id === serviceId);
  }
}

// ── Init: load persisted prefs ────────────────────────────────────────────────
chrome.storage.sync.get(
  { selectedService: services[0].id, autoCopy: true },
  (prefs) => {
    if (chrome.runtime.lastError) {
      console.warn('[Ziplink] Storage read failed, using defaults:', chrome.runtime.lastError.message);
    }
    const knownIds = services.map(s => s.id);
    selectedService = knownIds.includes(prefs.selectedService)
      ? prefs.selectedService
      : services[0].id;
    autoCopy = prefs.autoCopy ?? true;
    applyPillSelection(selectedService);
    toggleAuto.checked = autoCopy;
  }
);

// ── State renderers ───────────────────────────────────────────────────────────
function setStateIdle() {
  resultArea.className = 'result-idle';
  resultArea.innerHTML = '<p class="idle-placeholder">Result will appear here</p>';
}

function setStateLoading(serviceId) {
  btnShorten.disabled = true;
  btnShorten.classList.add('loading');
  controlsRow.classList.add('locked');

  resultArea.className = 'result-loading';
  resultArea.innerHTML = `
    <svg class="spinner" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="31.416" stroke-dashoffset="10" stroke-linecap="round"/>
    </svg>
    <span class="loading-text">Contacting ${getService(serviceId).name}...</span>
  `;
}

function setStateSuccess(shortUrl) {
  btnShorten.disabled = false;
  btnShorten.classList.remove('loading');
  controlsRow.classList.remove('locked');

  resultArea.className = 'result-success';
  resultArea.innerHTML = '';

  const label = document.createElement('span');
  label.className = 'result-label';
  label.textContent = 'Shortened URL';

  const card = document.createElement('div');
  card.className = 'result-card';

  const link = document.createElement('a');
  link.className = 'result-url';
  link.href = shortUrl;
  link.textContent = shortUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';

  const btnCopy = document.createElement('button');
  btnCopy.className = 'btn-copy';
  btnCopy.type = 'button';
  btnCopy.textContent = 'Copy';

  card.appendChild(link);
  card.appendChild(btnCopy);
  resultArea.appendChild(label);
  resultArea.appendChild(card);

  // Auto-copy behaviour
  if (autoCopy) {
    copyToClipboard(shortUrl, btnCopy);
  }

  btnCopy.addEventListener('click', () => {
    copyToClipboard(shortUrl, btnCopy);
  });
}

function setStateError(message) {
  btnShorten.disabled = false;
  btnShorten.classList.remove('loading');
  controlsRow.classList.remove('locked');

  // Sanitise message before inserting as text
  const safeMessage = document.createTextNode(message);
  resultArea.className = 'result-error';
  resultArea.innerHTML = '';

  const card = document.createElement('div');
  card.className = 'error-card';

  const icon = document.createElement('span');
  icon.className = 'error-icon';
  icon.textContent = '⚠️';

  const msg = document.createElement('span');
  msg.className = 'error-message';
  msg.appendChild(safeMessage);

  card.appendChild(icon);
  card.appendChild(msg);
  resultArea.appendChild(card);
}

// ── Copy helper ───────────────────────────────────────────────────────────────
function copyToClipboard(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = '✓ Copied';
    btn.classList.add('copied');
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Copy';
      btn.classList.remove('copied');
      btn.disabled = false;
    }, 2000);
  }).catch(() => {
    btn.textContent = 'Copy failed';
    setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
  });
}

// ── Auto-copy toggle ──────────────────────────────────────────────────────────
toggleAuto.addEventListener('change', () => {
  autoCopy = toggleAuto.checked;
  chrome.storage.sync.set({ autoCopy });
});

// ── Main button: shorten ──────────────────────────────────────────────────────
btnShorten.addEventListener('click', async () => {
  setStateLoading(selectedService);

  let url;
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    url = tab?.url;
    if (!url) throw new Error('Could not read the current tab URL.');
  } catch (err) {
    setStateError(err.message || 'Could not access the current tab.');
    return;
  }

  try {
    const shortUrl = await getService(selectedService).shorten(url);
    setStateSuccess(shortUrl);
  } catch (err) {
    setStateError(err.message || 'Something went wrong. Please try again.');
  }
});
