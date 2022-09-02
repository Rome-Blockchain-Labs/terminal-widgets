import BigNumber from 'bignumber.js';
import { BigNumber as EthersBigNumber } from 'ethers';

import {
  CONTRACTS_BY_NAME,
  MAINNET_CHAINID,
  TOKENS,
} from '../../../../constants';
import { Token } from '../../../../types';
import { getContract } from '../../../../utils';
import getAccount from '../../../../utils/getAccount';
import getProvider from '../../../../utils/getProvider';

const oldDecimals: {
  [token in 'AVAX' | 'DAI' | 'LINK' | 'USDT' | 'WBTC' | 'ETH']: number;
} = {
  AVAX: 18,
  DAI: 18,
  ETH: 18,
  LINK: 18,
  USDT: 6,
  WBTC: 8,
};

const getOldTokenBalance = async () => {
  const provider = await getProvider();
  const account = await getAccount();

  const { chainId } = await provider._networkPromise;

  if (chainId !== MAINNET_CHAINID) {
    return Object.assign(
      {},
      ...TOKENS.map((token) => ({
        [token]: new BigNumber(0),
      }))
    );
  }

  const oldTokens: {
    [token in 'AVAX' | 'DAI' | 'LINK' | 'USDT' | 'WBTC' | 'ETH']: string;
  } = {
    AVAX: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7', // WAVAX
    DAI: '0xbA7dEebBFC5fA1100Fb055a87773e1E99Cd3507a',
    ETH: '0xf20d962a6c8f70c731bd838a3a388D7d48fA6e15',
    LINK: '0xB3fe5374F67D7a22886A0eE082b2E2f9d2651651',
    USDT: '0xde3A24028580884448a5397872046a019649b084',
    WBTC: '0x408D4cD0ADb7ceBd1F1A1C33A0Ba2098E1295bAB',
  };

  const balancePromises = Object.entries(oldTokens).map(
    ([tokenName, address]) => {
      const token = tokenName as Token;
      const tokenContractInfo = CONTRACTS_BY_NAME[token];
      const tokenContract = getContract(
        address,
        tokenContractInfo.ABI,
        provider,
        account
      );

      return tokenContract
        .balanceOf(account)
        .then((response: EthersBigNumber) => {
          const balance = new BigNumber(response.toString()).shiftedBy(
            -oldDecimals[
              token as 'AVAX' | 'DAI' | 'LINK' | 'USDT' | 'WBTC' | 'ETH'
            ]
          );

          return {
            balance,
            token,
          };
        });
    }
  );

  return Promise.all(balancePromises).then((balancesByToken) => {
    const balances = Object.assign(
      {},
      ...balancesByToken.map(({ balance, token }) => ({
        [token]: balance.toString(),
      }))
    );

    return {
      data: balances,
    };
  });
};

export default getOldTokenBalance;
