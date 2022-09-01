import { BigNumber as EthersBigNumber } from '@ethersproject/bignumber';
import BigNumber from 'bignumber.js';

import { CONTRACTS_BY_NAME, DECIMALS, TOKENS } from '../../../../constants';
import { ContractAddresses } from '../../../../types';
import { getContract } from '../../../../utils';
import getAccount from '../../../../utils/getAccount';
import getProvider from '../../../../utils/getProvider';

const getWalletBalance = async (contractAddresses: ContractAddresses) => {
  const provider = await getProvider();
  const account = await getAccount();

  const balancePromises = TOKENS.map((token) => {
    if (token === 'AVAX') {
      return provider
        .getBalance(account)
        .then((rawBalance: EthersBigNumber) => {
          const balance = new BigNumber(rawBalance.toString()).div(
            new BigNumber(10).pow(DECIMALS.AVAX)
          );

          return {
            balance,
            token,
          };
        });
    }

    const tokenContractInfo = CONTRACTS_BY_NAME[token];
    const tokenContract = getContract(
      contractAddresses[token],
      tokenContractInfo.ABI,
      provider,
      account
    );

    return tokenContract.balanceOf(account).then((balance: EthersBigNumber) => {
      return {
        balance: new BigNumber(balance.toString()).shiftedBy(-DECIMALS[token]),
        token,
      };
    });
  });

  return Promise.all(balancePromises).then((balances) => {
    const newBalances = Object.assign(
      {},
      ...balances.map(({ balance, token }) => ({
        [token]: balance.toString(),
      }))
    );

    return {
      data: newBalances,
    };
  });
};

export default getWalletBalance;
