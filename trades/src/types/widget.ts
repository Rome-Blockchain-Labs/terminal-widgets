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
  VELOX = 'velox',
  TRADERJOE = 'traderjoe',
  KYBERSWAP = 'kyberswap',
  MDEX = 'mdex',
  PANCAKESWAP = 'pancakeswap',
  AVAX_BRIDGE = 'avax_bridge',
  BENQI = 'benqi',
  BISWAP = 'biswap',
  BEAMSWAP = 'beamswap',
  SOLARBEAM = 'solarbeam',
  NETSWAP = 'netswap',
  HERMESPROTOCOL = 'hermesprotocol',
  DEXPOOLS = 'dexpools',
  SUSHISWAP = 'sushiswap',
  UNISWAPV2 = 'uniswapv2',
  UNISWAPV3 = 'uniswapv3',
  METIS_BRIDGE = 'metis_bridge',
  AXIAL = 'axial',
  BENQI_STAKING = 'benqi_staking',
  SNOWBALL = 'snowball',
  VENUS = 'venus',
  CHARTONLY = 'non_existant_widget',
  MOONWELL = 'moonwell',
  CRYSTALVALE = 'crystalvale',
  BANXA = 'banxa',
  CONNEXT_BRIDGE = 'connext_bridge',
  SYNAPSE_BRIDGE = 'synapse_bridge',
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
