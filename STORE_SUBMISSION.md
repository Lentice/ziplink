# Chrome Web Store Submission Guide — Ziplink

## Pre-Submission Checklist

- [ ] Replace placeholder icons with a real Ziplink logo (16/48/128px PNG)
- [ ] Privacy policy page is live at a public URL (see PRIVACY_POLICY.md)
- [ ] Test the extension locally (see Testing section below)
- [ ] Take at least one screenshot (1280×800 or 640×400)

---

## Local Testing

1. Open Chrome and go to `chrome://extensions`
2. Enable **Developer mode** (toggle, top right)
3. Click **Load unpacked** → select the `E:\test_shortcut` folder
4. The Ziplink icon appears in your Chrome toolbar

**Test checklist:**
- [ ] Navigate to any HTTPS page → click Ziplink → click "Shorten This Page" → short URL appears
- [ ] Clipboard contains the short URL (auto-copy ON by default)
- [ ] Toggle to v.gd → shorten again → result uses v.gd domain
- [ ] Close and reopen popup → service selection is remembered
- [ ] Turn off Auto-copy → shorten → click "Copy" button manually → clipboard updated, shows "✓ Copied"
- [ ] Test with a very long URL (e.g. a Google Maps link)

---

## Step 1 — Create Developer Account

1. Go to: https://chrome.google.com/webstore/devconsole
2. Sign in with a Google account
3. Pay the **one-time $5 USD** developer registration fee
4. Accept the Developer Agreement

---

## Step 2 — Prepare the ZIP

Files to include:
```
manifest.json
popup.html
popup.css
popup.js
icons/
  icon16.png
  icon48.png
  icon128.png
services/
  isgd.js
  vgd.js
  registry.js
```

Files to **exclude** (do NOT include in ZIP):
- `PRIVACY_POLICY.md`
- `STORE_SUBMISSION.md`
- `.git/`
- `.superpowers/`
- Any `*.md` files

**Create the ZIP (PowerShell):**
```powershell
$files = @('manifest.json','popup.html','popup.css','popup.js','icons','services')
Compress-Archive -Path $files -DestinationPath ziplink.zip
```

---

## Step 3 — Submit to the Store

1. Go to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Click **+ New item**
3. Upload `ziplink.zip`
4. Fill in the store listing:

### Store Listing Fields

| Field | Value |
|---|---|
| **Name** | Ziplink |
| **Short description** (≤132 chars) | Shorten the current page URL instantly using is.gd or v.gd. Result auto-copied to your clipboard. |
| **Category** | Productivity |
| **Language** | English |
| **Privacy Policy URL** | Your GitHub Pages URL (from PRIVACY_POLICY.md) |

**Detailed description (copy-paste):**
```
Ziplink shortens the URL of any page you're browsing with a single click, using is.gd or v.gd.

Features:
• One-click URL shortening — no typing, no copying
• Auto-copies the short URL to your clipboard
• Switch between is.gd and v.gd services
• Your preference is remembered across browser sessions
• Clean, minimal popup — no distractions

Privacy: Ziplink sends URLs directly to is.gd/v.gd's public API. No data ever passes through our servers.
```

### Permissions Justification

When prompted to justify permissions, use these explanations:

| Permission | Justification |
|---|---|
| `activeTab` | Required to read the URL of the current browser tab for shortening |
| `clipboardWrite` | Required to auto-copy the shortened URL to the clipboard |
| `storage` | Required to remember the user's selected service and auto-copy preference |
| `host_permissions: https://is.gd/*` | Required to call the is.gd URL shortening API |
| `host_permissions: https://v.gd/*` | Required to call the v.gd URL shortening API |

### Screenshots

Take at least 1 screenshot at **1280×800** showing:
- The extension popup open with a shortened URL visible
- The "✓ Copied" state is a good moment to capture

---

## Step 4 — Submit for Review

1. Click **Submit for review**
2. Expected review time: **1–3 business days**
3. You will receive an email when approved or if changes are needed

**If rejected:**
- Read the rejection reason carefully
- Fix the specific issue noted
- Resubmit (no additional fee)
- Common rejection reasons: misleading description, missing privacy policy, permissions not justified

---

## Step 5 — After Approval

- Your extension will be live at: `https://chromewebstore.google.com/detail/ziplink/<extension-id>`
- Share the link with users
- To publish updates: bump `version` in `manifest.json`, re-zip, upload in the dashboard

---

## Adding More Shortening Services (Future)

To add a new service (e.g. bit.ly):

1. Create `services/bitly.js`:
```js
export default {
  id: 'bitly',
  name: 'bit.ly',
  async shorten(url) {
    // implement API call here
    // return shortUrl string or throw Error
  }
};
```

2. Add to `services/registry.js`:
```js
import bitly from './bitly.js';
// ...
export const services = [isgd, vgd, bitly];
```

3. Add to `manifest.json` host_permissions if the new service uses a different domain.

That's it — popup.js picks up new services automatically from the registry.
