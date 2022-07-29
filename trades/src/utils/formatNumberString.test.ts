import { formatNumberString } from './formatNumberString';

describe('formatNumberString', () => {
  it('should work with less than 1', () => {
    expect(formatNumberString('0.0001')).toEqual('0.0001');
    expect(formatNumberString('0.00000001')).toEqual('1.0e-8');
  });
  it('should work with regular numbers', () => {
    expect(formatNumberString('1234')).toEqual('1234');
    expect(formatNumberString('12.123')).toEqual('12,123');
  });
  it('should work with massive numbers numbers', () => {
    expect(formatNumberString('123456789')).toEqual('123.5 Million');
    expect(formatNumberString('12345678901234567890')).toEqual(
      '12.3 Quintillion'
    );
  });
});
