import { Pair } from '../types';

export const getNormalizedPriceString = (originalPrice: string | number) => {
  const price =
    typeof originalPrice === 'string'
      ? parseFloat(originalPrice)
      : originalPrice;

  if (price >= 10) {
    return price.toFixed(2);
  }
  return price.toFixed(4);
};

export const getTickAmountFromPrice = (price: number | string) => {
  if (price >= 1000) {
    return 10;
  }
  if (price >= 100) {
    return 100;
  }
  if (price >= 10) {
    return 10000;
  }
  if (price >= 1) {
    return 10000;
  }
  const priceStr = price.toString().slice(2);
  let zeros = 0;
  for (const ch of priceStr) {
    if (ch === '0') {
      zeros++;
    } else {
      break;
    }
  }

  return Math.min(10 ** (zeros + 4), 1e15);
};

export const isPairEqual = (pair1?: Pair, pair2?: Pair) => {
  if (!pair1 || !pair2) {
    return false;
  }

  return (
    pair1.token0.address === pair2.token0.address &&
    pair1.token1.address === pair2.token1.address &&
    pair1.exchange === pair2.exchange
  );
};
