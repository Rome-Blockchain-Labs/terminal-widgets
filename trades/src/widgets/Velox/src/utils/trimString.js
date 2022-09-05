import { renderedDecimals } from '../config';
const re = new RegExp('^-?\\d+(?:.\\d{0,' + renderedDecimals + '})?');
export const trim = (strOrNum) =>
  strOrNum.toString().replace(',', '.').match(re)?.[0] || '';
