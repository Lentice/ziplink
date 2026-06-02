# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Ziplink is a Chrome extension (Manifest V3) that shortens the current tab's URL via is.gd or v.gd. No build step, no bundler, no package manager — Chrome loads the files directly as ES modules.

## Loading / Testing

1. Open `chrome://extensions` in Chrome
2. Enable **Developer mode**
3. **Load unpacked** → select this folder
4. Click the Ziplink toolbar icon to open the popup

After any code change, click the refresh icon on the extension card in `chrome://extensions`.

## Regenerating Icons

Requires Python + Pillow (`pip install Pillow`):

```powershell
python generate_icons.py
```

Outputs `icons/icon16.png`, `icons/icon48.png`, `icons/icon128.png`.

## Publishing ZIP

```powershell
$files = @('manifest.json','popup.html','popup.css','popup.js','icons','services')
Compress-Archive -Path $files -DestinationPath ziplink.zip
```

Exclude: `.git/`, `.superpowers/`, `*.md`, `generate_icons.py`.

## Architecture

```
popup.html / popup.css / popup.js   — single popup UI, no background service worker
services/
  registry.js   — getService(id) lookup with isgd fallback
  isgd.js       — is.gd API adapter
  vgd.js        — v.gd API adapter
```

**Service contract** — every service module exports a default object:
```js
{ id: string, name: string, shorten(url): Promise<string> }
// shorten() must return the short URL or throw an Error with a human-readable message
```

`popup.js` dynamic-imports `registry.js` on button click (MV3-safe). User prefs (`selectedService`, `autoCopy`) are persisted via `chrome.storage.sync`.

**Adding a new shortening service:**
1. Create `services/newservice.js` implementing the contract above
2. Import and add it to `services` array in `registry.js`
3. Add the service domain to `host_permissions` in `manifest.json`

The popup picks up new services automatically — no other changes needed.
