import isgd from './isgd.js';
import vgd from './vgd.js';
import tinyurl from './tinyurl.js';
import spoome from './spoome.js';

export const services = [isgd, vgd, tinyurl, spoome];
export const getService = (id) => {
  const svc = services.find(s => s.id === id);
  if (!svc) console.warn(`[Ziplink] Unknown service id: "${id}", falling back to isgd`);
  return svc ?? isgd;
};
