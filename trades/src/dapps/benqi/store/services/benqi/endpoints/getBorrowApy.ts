import BigNumber from 'bignumber.js';
import { BigNumber as EthersBigNumber } from 'ethers';

import {
  DAYS_PER_YEAR,
  TIMESTAMPS_PER_DAY,
  TOKEN_QI_PAIRS,
  TOKENS,
} from '../../../../constants';
import { ContractAddresses } from '../../../../types';
import { getQiContractFromToken } from '../../../../utils';

const getBorrowApy = (contractAddresses: ContractAddresses) => {
  const borrowApyPromises = TOKENS.map(async (token) => {
    return getQiContractFromToken(
      token,
      contractAddresses[TOKEN_QI_PAIRS[token]]
    )
      .then((tokenContract) => tokenContract.borrowRatePerTimestamp())
      .then((borrowRate: EthersBigNumber) => {
        const borrowBase = new BigNumber(borrowRate.toString())
          .shiftedBy(-18)
          .times(TIMESTAMPS_PER_DAY)
          .plus(1);

        const apy = borrowBase.pow(DAYS_PER_YEAR).minus(1).times(100);

        return {
          apy,
          token,
        };
      });
  });

  return Promise.all(borrowApyPromises).then((borrowApy) => {
    return {
      data: Object.assign(
        {},
        ...borrowApy.map(({ apy, token }) => ({
          [token]: apy.toString(),
        }))
      ),
    };
  });
};

export default getBorrowApy;
