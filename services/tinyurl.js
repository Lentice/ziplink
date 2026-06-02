export default {
  id: 'tinyurl',
  name: 'TinyURL',
  async shorten(url) {
    const res = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
    if (!res.ok) throw new Error(`TinyURL returned HTTP ${res.status}`);
    const text = (await res.text()).trim();
    if (!text || text.startsWith('Error')) throw new Error(text || 'Unknown error from TinyURL');
    return text;
  }
};
