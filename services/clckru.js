export default {
  id: 'clckru',
  name: 'Clck.ru',
  async shorten(url) {
    const res = await fetch(`https://clck.ru/--?url=${encodeURIComponent(url)}`);
    if (!res.ok) throw new Error(`Clck.ru returned HTTP ${res.status}`);
    const text = (await res.text()).trim();
    if (!text.startsWith('https://')) throw new Error(text || 'Invalid response from Clck.ru');
    return text;
  }
};
