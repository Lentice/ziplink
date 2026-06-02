# Ziplink

Chrome extension (Manifest V3) that shortens the current tab's URL in one click. Supports is.gd, v.gd, TinyURL, and spoo.me. Result auto-copies to clipboard.

No build step. No bundler. No dependencies. Chrome loads the files directly as ES modules.

## Install (development)

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. **Load unpacked** → select this folder
4. Click the Ziplink icon in the toolbar

After any code change, click the refresh icon on the extension card.

## Usage

1. Navigate to any page
2. Click the Ziplink toolbar icon
3. Select a shortening service (pill buttons)
4. Click **Shorten**
5. Short URL appears and is auto-copied to clipboard

Toggle **Auto-copy** off to copy manually.

## Services

| Service | Domain |
|---------|--------|
| is.gd | `https://is.gd/` |
| v.gd | `https://v.gd/` |
| TinyURL | `https://tinyurl.com/` |
| spoo.me | `https://spoo.me/` |

Preferences (selected service, auto-copy) persist via `chrome.storage.sync`.

## Adding a service

1. Create `services/newservice.js` implementing the contract:
   ```js
   export default {
     id: 'newservice',
     name: 'New Service',
     async shorten(url) {
       // call API, return short URL string or throw Error
     }
   };
   ```
2. Import and add to the `services` array in `services/registry.js`
3. Add the service domain to `host_permissions` in `manifest.json`
4. Add a pill button in `popup.html` with `data-service="newservice"`

## Regenerating icons

Requires Python + Pillow:

```powershell
pip install Pillow
python generate_icons.py
```

Outputs `icons/icon16.png`, `icons/icon48.png`, `icons/icon128.png`.

## Publishing

```powershell
$files = @('manifest.json','popup.html','popup.css','popup.js','icons','services')
Compress-Archive -Path $files -DestinationPath ziplink.zip
```

Upload `ziplink.zip` to the Chrome Web Store developer dashboard.

## File structure

```
manifest.json       — MV3 manifest
popup.html          — popup markup
popup.css           — popup styles
popup.js            — popup logic
services/
  registry.js       — service lookup (getService)
  isgd.js           — is.gd adapter
  vgd.js            — v.gd adapter
  tinyurl.js        — TinyURL adapter
  spoome.js         — spoo.me adapter
icons/
  icon16.png
  icon48.png
  icon128.png
generate_icons.py   — icon generator (Python + Pillow)
```

## Permissions

| Permission | Reason |
|------------|--------|
| `activeTab` | Read current tab URL |
| `clipboardWrite` | Auto-copy short URL |
| `storage` | Persist service/auto-copy prefs |
