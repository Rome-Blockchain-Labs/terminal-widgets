import { getTickAmountFromPrice } from './price';

describe('getTickAmountFromPrice', () => {
  it('should give appropriate tick values', () => {
    expect(getTickAmountFromPrice('0.0000000001')).toEqual(10000000000000);
    expect(getTickAmountFromPrice('0.00001')).toEqual(100000000);
    expect(getTickAmountFromPrice('0.1')).toEqual(10000);
    expect(getTickAmountFromPrice('1')).toEqual(10000);
    expect(getTickAmountFromPrice('10')).toEqual(10000);
    expect(getTickAmountFromPrice('1000')).toEqual(10);
    expect(getTickAmountFromPrice('100000000000000')).toEqual(10);
    expect(
      getTickAmountFromPrice('1000000000000000000000000000000000')
    ).toEqual(10);
    expect(
      getTickAmountFromPrice('0.0000000000000000000000000000000001')
    ).toEqual(100000000000000000000);
  });
});
