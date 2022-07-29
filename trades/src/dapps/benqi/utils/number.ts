import { BigNumberish } from '@ethersproject/bignumber';
import BigNumber from 'bignumber.js';
import { BigNumber as EthersBigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';

import { DECIMALS, MAX_PERCENTAGE_VALUE } from '../constants';
import { Token } from '../types';

export const getNumber = (
  bignumber: EthersBigNumber,
  decimals: BigNumberish
) => {
  return parseFloat(formatUnits(bignumber, decimals));
};

const prefixes = [
  'y',
  'z',
  'a',
  'f',
  'p',
  'n',
  'μ',
  'm',
  '',
  'k',
  'M',
  'G',
  'T',
  'P',
  'E',
  'Z',
  'Y',
];

/**
 * Format the value using metric prefixes, typically (excluding values outside of
 * the [-1e24, 1e24] range, i.e., values smaller than yocto and larger than yotta)
 * returning a value in the range of [1, 1000[.
 *
 *
 * Example outputs (decimalPlaces = 2)
 * -----------------------------------
 *
 * | input                  | output                 |
 * |------------------------|------------------------|
 * | 0.0003499726885169519  | 349.97μ                |
 * | 100.00237877245982     | 100.00                 |
 * | 1234                   | 1.23k                  |
 * | 54342352312.12312312   | 54.34G                 |
 * | 1e30                   | 1000000.00Y            |
 *
 * @param value Value to format
 * @param decimalPlaces Number of decimal places in the output value
 * @return string Formatted value
 */
export const formatWithSuffix = (
  value: BigNumber,
  decimalPlaces: number = 1
): string => {
  const [integer, decimals] = (value.isNaN() ? new BigNumber(0) : value)
    .toFixed()
    .replace('-', '')
    .split('.');

  let tier = 0;
  if (integer !== '0') {
    // Math.floor(Math.log10(value) / 3) equivalent for big numbers
    tier = Math.floor((integer.length - 1) / 3);
  } else if (decimals !== undefined) {
    // Number of leading zeroes divided by three, the prefix exponent scaler
    const lastZeroIndex = decimals.search(/0[^0]/);
    if (lastZeroIndex !== -1) {
      tier = Math.min(-1, -Math.floor((lastZeroIndex + 1) / 3) - 1);
    }
  }

  tier = Math.min(8, Math.max(-8, tier));

  // Negative tiers represent sub-one values. Prefix index needs to be shifted and
  // mirrored around the center point of the prefix array, i.e., 8.
  const prefixIndex = tier >= 0 ? tier + 8 : 8 + tier;
  const prefix = prefixes[prefixIndex];

  const scaledValue = value.shiftedBy(-tier * 3);
  const rounded = getFormattedNumber(scaledValue, decimalPlaces);

  return `${rounded}${prefix}`;
};

export const formatWithSuffixLite = (
  value: BigNumber,
  decimalPlaces: number = 2
): string => {
  let suffix = '';
  let shiftBy = 0;

  if (value.gt(1_000_000)) {
    suffix = 'M';
    shiftBy = -6;
  } else if (value.gt(1_000)) {
    suffix = 'k';
    shiftBy = -3;
  }

  const scaledValue = getFormattedNumber(
    value.shiftedBy(shiftBy),
    decimalPlaces
  );

  return `${scaledValue}${suffix}`;
};

export const getFormattedTokenAmount = (amount: BigNumber, token: Token) => {
  const decimals = DECIMALS[token];

  return amount.toFormat(decimals);
};

export const getFormattedNumber = (amount: BigNumber, decimals = 2) => {
  return amount.toFormat(decimals);
};

export const getLimitedPercentage = (percentage: BigNumber) => {
  return percentage.gt(MAX_PERCENTAGE_VALUE)
    ? new BigNumber(MAX_PERCENTAGE_VALUE)
    : percentage;
};
