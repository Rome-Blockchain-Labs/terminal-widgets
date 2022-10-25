import { FC } from 'react';

import { IIconProps } from '../components/icons';
import { ExchangeType, NetworkName } from '../constants/networkExchange';
import { Pair } from './';

export type WidgetToolbar =
  | 'external-links'
  | 'exchange'
  | 'actions'
  | 'benqi'
  | undefined;

export type WidgetCommonState = {
  uid: string;
  pair?: Pair;
  blockchain: NetworkName;
  exchangeType?: ExchangeType;
  disableDuplication?: boolean;
  width?: number;
  allowedNetworks?: NetworkName[];
};

export enum WidgetEnlargementStatus {
  NONE,
  ENLARGED,
  FULLSCREEN,
}

export type WidgetState = WidgetCommonState & {
  type?: WidgetType;
  enlargement?: WidgetEnlargementStatus;
  isTable?: boolean;
  isTokenDetailsOpened?: boolean;
  toolbar?: WidgetToolbar;
  targetPosition: number;
  createdAt?: Date;
};

export enum WidgetType {
  TRANSACTIONS = 'transactions',
  PANGOLIN = 'pangolin',
  TRADERJOE = 'traderjoe',
  PANCAKESWAP = 'pancakeswap',
  BEAMSWAP = 'beamswap',
  SOLARBEAM = 'solarbeam',
  NETSWAP = 'netswap',
  SUSHISWAP = 'sushiswap',
  UNISWAPV2 = 'uniswapv2',
  CHARTONLY = 'non_existant_widget',
  CRYSTALVALE = 'crystalvale',
  VELOX = 'velox',
}

export type AddWidgetState = Pick<
  WidgetState & { startEnlarged?: boolean },
  | 'type'
  | 'isTable'
  | 'pair'
  | 'blockchain'
  | 'exchangeType'
  | 'disableDuplication'
  | 'startEnlarged'
>;

export type ColumnType = {
  icon: FC<IIconProps>;
  tooltip: string;
};

export enum WidgetMode {
  IFRAME = 'iframe',
  NATIVE = 'native',
}

export enum MobileMenuWidgetAction {
  INIT,
  ADDED,
  REMOVED,
}

export type EnlargementState = {
  uid: string;
  isMobile: boolean;
};
