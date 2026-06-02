export default {
  id: 'spoome',
  name: 'spoo.me',
  async shorten(url) {
    const res = await fetch('https://spoo.me/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
      body: new URLSearchParams({ url }),
    });
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { throw new Error(text.trim() || `spoo.me returned HTTP ${res.status}`); }
    if (!res.ok) throw new Error(data?.message ?? data?.error ?? `spoo.me returned HTTP ${res.status}`);
    return data.short_url;
  }
};
