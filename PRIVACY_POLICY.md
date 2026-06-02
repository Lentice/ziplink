# Ziplink — Privacy Policy

**Last updated:** 2026-06-02

Ziplink is a Chrome extension that shortens URLs using the is.gd and v.gd public APIs.

## Data We Collect

**None.** Ziplink does not collect, store, log, or transmit any personal data to our servers.

## How It Works

When you click "Shorten This Page", the URL of your current browser tab is sent **directly from your browser** to the is.gd or v.gd public API (whichever service you have selected). No data passes through any server we operate.

Your service preference (is.gd or v.gd) and auto-copy setting are stored locally in Chrome's sync storage (`chrome.storage.sync`). This data stays within your Chrome profile and is not accessible to us.

## Third-Party Services

The is.gd and v.gd URL shortening APIs are operated by third parties. When you shorten a URL, it is subject to their terms and privacy policies:

- is.gd Terms: https://is.gd/terms.php
- is.gd Privacy: https://is.gd/privacy.php

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
  <p><strong>Last updated:</strong> 2026-06-02</p>
  <p>Ziplink does not collect, store, or transmit any personal data. When you shorten a URL, it is sent directly from your browser to the is.gd or v.gd public API. No data passes through our servers.</p>
  <p>Your preferences (selected service, auto-copy setting) are stored locally in Chrome's sync storage and are not accessible to us.</p>
  <h2>Third-Party Services</h2>
  <p>Shortened URLs are processed by is.gd / v.gd under their own <a href="https://is.gd/terms.php">terms</a> and <a href="https://is.gd/privacy.php">privacy policy</a>.</p>
</body>
</html>
```
