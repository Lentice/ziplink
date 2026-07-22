export default {
  id: 'hideuri',
  name: 'HideURI',
  async shorten(url) {
    const res = await fetch('https://hideuri.com/api/v1/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `url=${encodeURIComponent(url)}`,
    });
    if (!res.ok) throw new Error(`HideURI returned HTTP ${res.status}`);
    const data = await res.json();
    if (data?.error) throw new Error(data.error);
    try {
      const shortUrl = new URL(data?.result_url);
      if (shortUrl.protocol !== 'https:' || shortUrl.hostname !== 'hideuri.com') throw new Error();
      return shortUrl.href;
    } catch {
      throw new Error('HideURI returned no short URL');
    }
  }
};
