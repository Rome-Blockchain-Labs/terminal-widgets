import { BigNumber as EthersBigNumber } from '@ethersproject/bignumber';
import BigNumber from 'bignumber.js';

import { DECIMALS, TOKEN_QI_PAIRS, TOKENS } from '../../../../constants';
import { ContractAddresses } from '../../../../types';
import { getQiContractFromToken } from '../../../../utils';

const getContractBorrowBalance = (contractAddresses: ContractAddresses) => {
  const borrowBalancePromises = TOKENS.map((token) => {
    return getQiContractFromToken(
      token,
      contractAddresses[TOKEN_QI_PAIRS[token]]
    ).then((contract) => {
      return contract.totalBorrows().then((totalBorrows: EthersBigNumber) => {
        return {
          balance: new BigNumber(totalBorrows.toString()).shiftedBy(
            -DECIMALS[token]
          ),
          token,
        };
      });
    });
  });

  return Promise.all(borrowBalancePromises).then((borrowBalances) => {
    return {
      data: Object.assign(
        {},
        ...borrowBalances.map(({ balance, token }) => ({
          [token]: balance.toString(),
        }))
      ),
    };
  });
};

export default getContractBorrowBalance;
