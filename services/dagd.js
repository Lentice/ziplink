export default {
  id: 'dagd',
  name: 'da.gd',
  async shorten(url) {
    const res = await fetch(`https://da.gd/shorten?url=${encodeURIComponent(url)}`);
    if (!res.ok) throw new Error(`da.gd returned HTTP ${res.status}`);
    const text = await res.text();
    const short = text.trim();
    if (!short.startsWith('http')) throw new Error(short || 'Invalid response from da.gd');
    return short;
  }
};
