export default {
  id: 'shrtr',
  name: 'Shrtr',
  async shorten(url) {
    const res = await fetch('https://shrtr.top/api/v1/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    if (res.status === 429) throw new Error('Shrtr rate limit reached (30/window)');
    if (!res.ok) throw new Error(`Shrtr returned HTTP ${res.status}`);
    const { short_url } = await res.json();
    if (!short_url) throw new Error('Shrtr returned no short_url');
    return short_url;
  }
};
