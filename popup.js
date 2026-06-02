// popup.js — Ziplink popup logic (ES module)
import { services, getService } from './services/registry.js';

const CACHE_MAX = 20;

// ── DOM refs ──────────────────────────────────────────────────────────────────
const btnShorten     = document.getElementById('btn-shorten');
const resultArea     = document.getElementById('result-area');
const controlsRow    = document.getElementById('controls-row');
const pillsContainer = document.getElementById('pills-container');
const toggleAuto        = document.getElementById('toggle-autocopy');
const toggleAutoShorten = document.getElementById('toggle-autoshorten');

// ── State ─────────────────────────────────────────────────────────────────────
let selectedService = services[0].id;
let autoCopy        = true;
let autoShorten     = false;
let currentTabUrl   = null;
let cache           = []; // [{ url, serviceId, shortUrl }], FIFO
let failedServices  = new Set();

// ── Cache helpers ─────────────────────────────────────────────────────────────
function cacheGet(url, serviceId) {
  return cache.find(e => e.url === url && e.serviceId === serviceId)?.shortUrl ?? null;
}

function cacheSet(url, serviceId, shortUrl) {
  cache = cache.filter(e => !(e.url === url && e.serviceId === serviceId));
  if (cache.length >= CACHE_MAX) cache.shift();
  cache.push({ url, serviceId, shortUrl });
  chrome.storage.session.set({ urlCache: cache });
}

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
      if (currentTabUrl) {
        const cached = cacheGet(currentTabUrl, selectedService);
        if (cached) { setStateSuccess(cached); return; }
      }
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

// ── Init: load prefs, cache, and tab URL in parallel ─────────────────────────
(async () => {
  const [prefs, sessionData, tabs] = await Promise.all([
    chrome.storage.sync.get({ selectedService: services[0].id, autoCopy: true, autoShorten: false }),
    chrome.storage.session.get({ urlCache: [], failedServices: [] }),
    chrome.tabs.query({ active: true, currentWindow: true }),
  ]);

  const knownIds = services.map(s => s.id);
  selectedService = knownIds.includes(prefs.selectedService)
    ? prefs.selectedService
    : services[0].id;
  autoCopy    = prefs.autoCopy    ?? true;
  autoShorten = prefs.autoShorten ?? false;
  cache          = sessionData.urlCache ?? [];
  failedServices = new Set(sessionData.failedServices ?? []);
  for (const id of failedServices) {
    const btn = pillMap.get(id);
    if (btn) {
      btn.classList.add('pill-error');
      btn.title = `${getService(id).name} failed — click to retry`;
    }
  }
  currentTabUrl = tabs[0]?.url ?? null;

  applyPillSelection(selectedService);
  toggleAuto.checked        = autoCopy;
  toggleAutoShorten.checked = autoShorten;

  if (currentTabUrl) {
    const cached = cacheGet(currentTabUrl, selectedService);
    if (cached) { setStateSuccess(cached); return; }
  }
  if (autoShorten) btnShorten.click();
})();

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

// ── Pill error mark ───────────────────────────────────────────────────────────
function markPillError(serviceId) {
  const btn = pillMap.get(serviceId);
  if (btn) {
    btn.classList.add('pill-error');
    btn.title = `${getService(serviceId).name} failed — click to retry`;
  }
  failedServices.add(serviceId);
  chrome.storage.session.set({ failedServices: [...failedServices] });
}

// ── Copy helper ───────────────────────────────────────────────────────────────
function copyToClipboard(text, btn) {
  const doWrite = () => {
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
  };
  if (document.hasFocus()) {
    doWrite();
  } else {
    window.addEventListener('focus', doWrite, { once: true });
  }
}

// ── Toggle listeners ──────────────────────────────────────────────────────────
toggleAutoShorten.addEventListener('change', () => {
  autoShorten = toggleAutoShorten.checked;
  chrome.storage.sync.set({ autoShorten });
});

toggleAuto.addEventListener('change', () => {
  autoCopy = toggleAuto.checked;
  chrome.storage.sync.set({ autoCopy });
});

// ── Main button: shorten ──────────────────────────────────────────────────────
btnShorten.addEventListener('click', async () => {
  const url = currentTabUrl;
  if (!url) {
    setStateError('Could not read the current tab URL.');
    return;
  }

  const cached = cacheGet(url, selectedService);
  if (cached) {
    setStateSuccess(cached);
    return;
  }

  setStateLoading(selectedService);
  try {
    const shortUrl = await getService(selectedService).shorten(url);
    cacheSet(url, selectedService, shortUrl);
    setStateSuccess(shortUrl);
  } catch (err) {
    markPillError(selectedService);
    setStateError(err.message || 'Something went wrong. Please try again.');
  }
});
