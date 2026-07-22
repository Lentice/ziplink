# Ziplink — Privacy Policy

**Last updated:** 2026-07-22

Ziplink is a Chrome extension that shortens URLs using a user-selected third-party URL shortening service.

## Data We Collect

**None.** Ziplink does not collect, store, log, or transmit any personal data to our servers.

## How It Works

When you click "Shorten This Page", the URL of your current browser tab is sent **directly from your browser** to the third-party URL shortening service you selected. No data passes through any server we operate.

Your selected service and auto-copy setting are stored in Chrome's sync storage (`chrome.storage.sync`). This data stays within your Chrome profile and is not accessible to us.

## Third-Party Services

Ziplink supports the following third-party URL shortening services:

- is.gd (`is.gd`)
- v.gd (`v.gd`)
- TinyURL (`tinyurl.com`)
- CleanURI (`cleanuri.com`)
- da.gd (`da.gd`)
- Clck.ru (`clck.ru`)
- Shrtr (`shrtr.top`)
- Ulvis (`ulvis.net`)

When you shorten a URL, the selected third party processes it under its own terms and privacy policy.

## Contact

For questions, open an issue on the extension's GitHub repository.

---

## Hosting This Policy on GitHub Pages

1. Create a new GitHub repo (e.g. `ziplink-privacy`)
2. Add a file named `index.html` with the HTML version of this text
3. Go to **Settings → Pages → Source: main branch**
4. Your policy URL will be: `https://<your-username>.github.io/ziplink-privacy`
5. Use that URL in the Chrome Web Store developer dashboard

### Minimal index.html template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ziplink — Privacy Policy</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 640px; margin: 40px auto; padding: 0 20px; line-height: 1.6; color: #333; }
    h1 { color: #0ea5e9; }
  </style>
</head>
<body>
  <h1>Ziplink — Privacy Policy</h1>
  <p><strong>Last updated:</strong> 2026-07-22</p>
  <p>Ziplink does not collect, store, or transmit any personal data. When you shorten a URL, it is sent directly from your browser to the third-party URL shortening service you selected. No data passes through our servers.</p>
  <p>Your preferences (selected service, auto-copy setting) are stored locally in Chrome's sync storage and are not accessible to us.</p>
  <h2>Third-Party Services</h2>
  <p>Ziplink supports is.gd, v.gd, TinyURL, CleanURI, da.gd, Clck.ru, Shrtr, and Ulvis. Shortened URLs are processed by the selected service under its own terms and privacy policy.</p>
</body>
</html>
```
