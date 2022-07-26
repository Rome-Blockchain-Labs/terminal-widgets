import { ReactNode } from 'react';

import { NetworkName } from '../constants/networkExchange';

export type Network = {
  id: NetworkName;
  name: string;
  icon?: ReactNode;
  activeIcon?: ReactNode;
};
