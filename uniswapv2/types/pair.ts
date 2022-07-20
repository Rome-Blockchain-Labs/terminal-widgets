import { ExchangeType, NetworkName } from '../constants/networkExchange';
import { WidgetType } from './widget';

export type Token = {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
};

export type Pair = {
  exchange: ExchangeType;
  address: string;
  token0: Token;
  token1: Token;
  blockchain: NetworkName;
};

export type PreferredToken = {
  widgetType: WidgetType;
  pair: Pair;
};
