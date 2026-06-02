export default {
  id: 'vgd',
  name: 'v.gd',
  async shorten(url) {
    const res = await fetch(`https://v.gd/create.php?format=json&url=${encodeURIComponent(url)}`);
    if (!res.ok) throw new Error(`v.gd returned HTTP ${res.status}`);
    const data = await res.json();
    if (data.errorcode) throw new Error(data.errormessage ?? 'Unknown error from v.gd');
    return data.shorturl;
  }
};
