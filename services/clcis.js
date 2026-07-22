export default {
  id: 'clcis',
  name: 'clc.is',
  async shorten(url) {
    const res = await fetch('https://clc.is/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain: 'clc.is', target_url: url }),
    });
    if (!res.ok) throw new Error(`clc.is returned HTTP ${res.status}`);
    const data = await res.json();
    try {
      const shortUrl = new URL(data?.[0]?.url);
      if (shortUrl.protocol !== 'https:' || shortUrl.hostname !== 'clc.is') throw new Error();
      return shortUrl.href;
    } catch {
      throw new Error('clc.is returned no short URL');
    }
  }
};
