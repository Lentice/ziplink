export default {
  id: 'cleanuri',
  name: 'CleanURI',
  async shorten(url) {
    const res = await fetch('https://cleanuri.com/api/v1/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `url=${encodeURIComponent(url)}`,
    });
    if (!res.ok) throw new Error(`CleanURI returned HTTP ${res.status}`);
    const data = await res.json();
    if (data?.error) throw new Error(data.error);
    return data.result_url;
  }
};
