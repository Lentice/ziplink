export default {
  id: 'ulvis',
  name: 'Ulvis',
  async shorten(url) {
    const endpoint = new URL('https://ulvis.net/api.php');
    endpoint.searchParams.set('url', url);
    endpoint.searchParams.set('private', '1');
    endpoint.searchParams.set('type', 'json');

    const res = await fetch(endpoint);
    if (!res.ok) throw new Error(`Ulvis returned HTTP ${res.status}`);
    const shortUrl = (await res.text()).trim();
    try {
      const parsed = new URL(shortUrl);
      if (parsed.protocol !== 'https:' || parsed.hostname !== 'ulvis.net') throw new Error();
    } catch {
      throw new Error('Ulvis returned no short URL');
    }
    return shortUrl;
  }
};
