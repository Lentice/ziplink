# URL shortener replacement research (2026-07-22)

## Scope and method

Goal: replace TinyURL and CleanURI with two general-purpose services that have operated for multiple years, publish API documentation, allow free anonymous API calls without an API key, and redirect without an advertising/interstitial page.

Live checks used a different benign HTTPS destination for each service. Creation responses were captured, then the generated link was requested with redirects disabled so the first HTTP status and `Location` header could be inspected. A `301`/`302` whose `Location` is the submitted target is treated as a direct redirect. This is a point-in-time check, not an uptime guarantee.

## Recommended candidates

### 1. HideURI

- Official documentation describes `POST /api/v1/shorten`, a form-encoded `url` parameter, JSON output, and a 100-calls-per-minute limit. It documents no authentication field or API key: <https://hideuri.com/docs>.
- The same first-party page carries `© Hide URI 2018-2023`, providing first-party evidence that the service has existed across multiple years: <https://hideuri.com/docs>.
- Independent live checks from the implementation agent successfully created links for three different authoritative targets (IANA, RFC Editor, and MDN); each generated link returned a single-hop `301` whose `Location` exactly matched its submitted target.
- Compatibility caveat: this research agent submitted a Library of Congress target and a Python PEP target. The API returned syntactically valid links (`https://hideuri.com/gmkGw6` and `https://hideuri.com/emkbE7`), but both generated links returned `404` twice rather than redirecting. HideURI therefore works in current live checks, but is demonstrably target-dependent. The adapter should fail clearly when creation returns an invalid response, but it cannot detect a broken generated link without an extra probe.

Assessment: meets the formal requirements based on multiple successful live targets and long-running first-party evidence, with a material domain-compatibility risk that should be documented.

### 2. clc.is

- Official API documentation explicitly says the public API needs no API key or authentication and documents `POST /api/links`: <https://clc.is/api>.
- The official homepage explicitly advertises “No Ads” and “No Registration Required,” and states that it does not inject ads: <https://clc.is/>.
- Domain registry records date `clc.is` to 2023-08-04. At the test date that is about two years and eleven months of domain history, so it satisfies “multiple years” literally, although it is substantially younger and less established than HideURI. Registry lookup: <https://www.isnic.is/en/whois/search?query=clc.is>.
- Live creation test used `https://www.iana.org/help/example-domains` and returned:

  ```json
  [{"input":{"domain":"clc.is","target_url":"https://www.iana.org/help/example-domains","expired_url":null,"expired_hours":0},"slug":"DqwOE","url":"https://clc.is/DqwOE","is_generated":true}]
  ```

- Requesting `https://clc.is/DqwOE` without following redirects returned `HTTP/1.1 302 Found` with `Location: https://www.iana.org/help/example-domains` and an empty response body. This is a direct redirect, not a visible interstitial.

Assessment: its domain history spans almost three years, but public snapshots do not prove that the current shortening service operated throughout that period. The user explicitly accepted this history exception after reviewing the caveat. It is the strongest second general-purpose candidate found after live-testing older alternatives.

## Rejected candidates

| Service | Reason rejected in live testing |
|---|---|
| 1pt.co | Both the current and legacy endpoints in its official README returned the University of Waterloo CSC `404` page. |
| GoTiny | Its official repository says the service is no longer available; the deployment is unavailable. |
| Cutt.us | Official API first returned error code `4` (“Service Temporarily Unavailable”), then Cloudflare `522` when retried with the recommended POST method. |
| Shorten.ly | The API returned success and a `tin.al` URL, but that URL redirected to `https://shorten.ly/404.html`, not the submitted W3C target. |
| 0x0.st | The service replied that uploads/shortening are disabled due to AI-botnet spam, with no restoration ETA. |
| x.gd | The current official developer documentation requires an API key, so it is not anonymous/no-login API access: <https://x.gd/developer>. |
| w.wiki | Established and direct, but only accepts Wikimedia-controlled targets, so it cannot shorten the extension's general current-tab URLs. |

## Integration recommendation

Append HideURI and then clc.is after the remaining services. Preserve the order because HideURI has the longer documented history, while clc.is is the fallback candidate with stronger live behavior but shorter history. Both adapters should validate the response URL's HTTPS scheme and expected hostname and throw service-specific human-readable errors.
