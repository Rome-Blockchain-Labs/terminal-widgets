export const isBoundContainsPosition = (
  rect: DOMRect,
  x: number,
  y: number
) => {
  return (
    rect.x < x &&
    rect.x + rect.width > x &&
    rect.y < y &&
    rect.y + rect.height > y
  );
};

export const formatDecimals = (
  number: number,
  decimalPoint: number,
  dollarSign: boolean = false
) => {
  const dollar = dollarSign ? '$' : '';
  return `${dollar}${(
    Math.round(number * Math.pow(10, decimalPoint)) / Math.pow(10, decimalPoint)
  ).toLocaleString()}`;
};
