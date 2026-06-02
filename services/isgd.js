export default {
  id: 'isgd',
  name: 'is.gd',
  async shorten(url) {
    const res = await fetch(`https://is.gd/create.php?format=json&url=${encodeURIComponent(url)}`);
    const data = await res.json();
    if (data.errorcode) throw new Error(data.errormessage);
    return data.shorturl;
  }
};
