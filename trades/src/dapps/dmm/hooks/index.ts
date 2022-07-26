import { ChainId } from '@dynamic-amm/sdk';
import { ethers } from 'ethers';

import { NETWORK_URLS } from '../connectors';

export const providers: {
  [chainId in ChainId]?: any;
} = {
  [ChainId.AVAXMAINNET]: new ethers.providers.JsonRpcProvider(
    NETWORK_URLS[ChainId.AVAXMAINNET]
  ),
};
