import { isZero } from './isZero';

describe('isZero', () => {
  it('should be truthy for many zeros', () => {
    expect(isZero('0x0')).toBeTruthy();
    expect(isZero('0x00000')).toBeTruthy();
    expect(isZero('0x0000000000')).toBeTruthy();
  });
  it('should be false without 0x prefix', () => {
    expect(isZero('0')).toBeFalsy();
  });
  it('should be false for text', () => {
    expect(isZero('hi')).toBeFalsy();
  });
  it('should be false for a non zero', () => {
    expect(isZero('0x01')).toBeFalsy();
  });
});
