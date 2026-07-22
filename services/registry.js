import isgd from './isgd.js';
import vgd from './vgd.js';
import tinyurl from './tinyurl.js';
import cleanuri from './cleanuri.js';
import dagd from './dagd.js';
import clckru from './clckru.js';
import shrtr from './shrtr.js';
import ulvis from './ulvis.js';
export const services = [isgd, vgd, tinyurl, cleanuri, dagd, clckru, shrtr, ulvis];
export const getService = (id) => {
  const svc = services.find(s => s.id === id);
  if (!svc) console.warn(`[Ziplink] Unknown service id: "${id}", falling back to isgd`);
  return svc ?? isgd;
};
