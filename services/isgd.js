export default {
  id: 'isgd',
  name: 'is.gd',
  async shorten(url) {
    const res = await fetch(`https://is.gd/create.php?format=json&url=${encodeURIComponent(url)}`);
    if (!res.ok) throw new Error(`is.gd returned HTTP ${res.status}`);
    const data = await res.json();
    if (data.errorcode) throw new Error(data.errormessage ?? 'Unknown error from is.gd');
    return data.shorturl;
  }
};
