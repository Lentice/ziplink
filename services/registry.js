import isgd from './isgd.js';
import vgd from './vgd.js';
import dagd from './dagd.js';
import clckru from './clckru.js';
import shrtr from './shrtr.js';
import ulvis from './ulvis.js';
import hideuri from './hideuri.js';
import clcis from './clcis.js';
export const services = [isgd, vgd, dagd, clckru, shrtr, ulvis, hideuri, clcis];
export const getService = (id) => {
  const svc = services.find(s => s.id === id);
  if (!svc) console.warn(`[Ziplink] Unknown service id: "${id}", falling back to isgd`);
  return svc ?? isgd;
};
