import isgd from './isgd.js';
import vgd from './vgd.js';

export const services = [isgd, vgd];
export const getService = (id) => services.find(s => s.id === id) ?? isgd;
