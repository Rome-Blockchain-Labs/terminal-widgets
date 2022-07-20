import { ReactNode } from 'react';

import { ExchangeType, NetworkName } from '../constants/networkExchange';

export type Exchange = {
  blockchain: NetworkName;
  id: ExchangeType;
  name: string;
  icon?: ReactNode;
  activeIcon?: ReactNode;
};
