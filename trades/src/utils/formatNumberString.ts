export function formatNumberString(str: string) {
  const num = Number(str);

  if (isNaN(num)) {
    return '?';
  }
  if (num < 1e-6) {
    return parseFloat(str).toExponential(1).toString();
  }
  if (num < 1e6) {
    return num.toLocaleString();
  }
  if (num < 1e9) {
    return Math.round(num / 1e5) / 10 + ' Million';
  }
  if (num < 1e12) {
    return Math.round(num / 1e8) / 10 + ' Billion';
  }
  if (num < 1e15) {
    return Math.round(num / 1e11) / 10 + ' Trillion';
  }
  if (num < 1e18) {
    return Math.round(num / 1e14) / 10 + ' Quadrillion';
  }
  if (num < 1e21) {
    return Math.round(num / 1e17) / 10 + ' Quintillion';
  }
  if (num < 1e24) {
    return Math.round(num / 1e20) / 10 + ' Nonillion';
  }
  if (num < 1e27) {
    return Math.round(num / 1e23) / 10 + ' Decillion';
  }
  return Math.round(num / 1e14) / 10 + ' Googol';
}
