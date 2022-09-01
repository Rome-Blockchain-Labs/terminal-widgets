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

const getSupplyApy = (contractAddresses: ContractAddresses) => {
  const supplyApyPromises = TOKENS.map(async (token) => {
    return getQiContractFromToken(
      token,
      contractAddresses[TOKEN_QI_PAIRS[token]]
    )
      .then((tokenContract) => tokenContract.supplyRatePerTimestamp())
      .then((supplyRate: EthersBigNumber) => {
        const supplyBase = new BigNumber(supplyRate.toString())
          .shiftedBy(-18)
          .times(TIMESTAMPS_PER_DAY)
          .plus(1);

        const apy = supplyBase.pow(DAYS_PER_YEAR).minus(1).times(100);

        return {
          apy,
          token,
        };
      });
  });

  return Promise.all(supplyApyPromises).then((supplyApy) => {
    return {
      data: Object.assign(
        {},
        ...supplyApy.map(({ apy, token }) => ({
          [token]: apy.toString(),
        }))
      ),
    };
  });
};

export default getSupplyApy;
