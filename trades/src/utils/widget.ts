import { WidgetState } from '../types';

export function getKeyFromWidget(widget: WidgetState): string {
  const { exchangeType, isTable, pair } = widget;
  let key = `${pair?.token0.address}${pair?.token1.address}${exchangeType}`;
  key = isTable ? `${key}-${isTable}` : key;
  return key;
}
