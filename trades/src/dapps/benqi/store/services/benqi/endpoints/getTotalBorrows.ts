import { BigNumber as EthersBigNumber } from '@ethersproject/bignumber';
import BigNumber from 'bignumber.js';

import { DECIMALS, TOKEN_QI_PAIRS, TOKENS } from '../../../../constants';
import { ContractAddresses } from '../../../../types';
import { getQiContractFromToken } from '../../../../utils';

const getTotalBorrows = async (contractAddresses: ContractAddresses) => {
  const totalBorrowPromises = TOKENS.map((token) => {
    return getQiContractFromToken(
      token,
      contractAddresses[TOKEN_QI_PAIRS[token]]
    )
      .then((qiContract) => qiContract.totalBorrows())
      .then((totalBorrows: EthersBigNumber) => {
        return {
          token,
          totalBorrows: new BigNumber(totalBorrows.toString()).shiftedBy(
            -DECIMALS[token]
          ),
        };
      });
  });

  return Promise.all(totalBorrowPromises).then((totalBorrowsPerToken) => {
    return {
      data: Object.assign(
        {},
        ...totalBorrowsPerToken.map(({ token, totalBorrows }) => ({
          [token]: totalBorrows.toString(),
        }))
      ),
    };
  });
};

export default getTotalBorrows;
