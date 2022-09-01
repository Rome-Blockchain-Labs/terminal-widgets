import BigNumber from 'bignumber.js';

import { BORROW_LIMIT_COLORS, HEALTH_INDICATOR_COLORS } from '../constants';

export const getHealthIndicatorColorFromBorrowLimit = (
  limitUsed: BigNumber
) => {
  const colorsByBorrowLimit = Object.entries(BORROW_LIMIT_COLORS).sort(
    ([a], [b]) => (parseInt(a, 10) > parseInt(b, 10) ? -1 : 1)
  );

  for (const [threshold, thresholdColor] of colorsByBorrowLimit) {
    if (limitUsed.gte(threshold)) {
      return thresholdColor;
    }
  }

  return Object.values(BORROW_LIMIT_COLORS)[
    Object.values(BORROW_LIMIT_COLORS).length - 1
  ];
};

export const getHealthIndicatorColorFromHealth = (health: BigNumber) => {
  const colorsByHealth = Object.entries(HEALTH_INDICATOR_COLORS).sort(
    ([a], [b]) => (parseInt(a, 10) > parseInt(b, 10) ? -1 : 1)
  );

  for (const [threshold, thresholdColor] of colorsByHealth) {
    if (health.gte(threshold)) {
      return thresholdColor;
    }
  }

  return HEALTH_INDICATOR_COLORS[0];
};
