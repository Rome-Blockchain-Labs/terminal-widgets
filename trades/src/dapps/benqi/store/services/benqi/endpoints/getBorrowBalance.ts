import { BigNumber as EthersBigNumber } from '@ethersproject/bignumber';
import BigNumber from 'bignumber.js';

import { DECIMALS, TOKEN_QI_PAIRS, TOKENS } from '../../../../constants';
import { ContractAddresses, Token } from '../../../../types';
import { getContract, getQiContractFromUnderlying } from '../../../../utils';
import getAccount from '../../../../utils/getAccount';
import getProvider from '../../../../utils/getProvider';

const getBorrowBalance = async (contractAddresses: ContractAddresses) => {
  const provider = await getProvider();
  const account = await getAccount();

  const borrowBalancePromises = TOKENS.map((token) => {
    const qiContractInfo = getQiContractFromUnderlying(token);
    const qiContractAddress = contractAddresses[TOKEN_QI_PAIRS[token]];
    const qiContract = getContract(
      qiContractAddress,
      qiContractInfo.ABI,
      provider,
      account
    );

    return qiContract
      .getAccountSnapshot(account)
      .then(
        ([, , balance]: [
          EthersBigNumber,
          EthersBigNumber,
          EthersBigNumber
        ]) => {
          return {
            balance: new BigNumber(balance.toString()).div(
              new BigNumber(10).pow(DECIMALS[token])
            ),
            token,
          };
        }
      )
      .catch(() => {
        return {
          balance: new BigNumber(0),
          token,
        };
      });
  });

  return Promise.all(borrowBalancePromises).then(
    (balances: { token: Token; balance: BigNumber }[]) => {
      const newBalances = Object.assign(
        {},
        ...balances.map(({ balance, token }) => ({
          [token]: balance.toString(),
        }))
      );

      return {
        data: newBalances,
      };
    }
  );
};

export default getBorrowBalance;
