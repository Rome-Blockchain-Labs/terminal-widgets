import { BigNumber as EthersBigNumber } from '@ethersproject/bignumber';
import BigNumber from 'bignumber.js';

import { DECIMALS, TOKEN_QI_PAIRS, TOKENS } from '../../../../constants';
import { ContractAddresses } from '../../../../types';
import { getComptroller } from '../../../../utils';

const getMarketBorrowCaps = async (contractAddresses: ContractAddresses) => {
  const comptroller = await getComptroller(contractAddresses.Comptroller);

  const marketBorrowCapPromises = TOKENS.map((token) => {
    const address = contractAddresses[TOKEN_QI_PAIRS[token]];

    return comptroller
      .borrowCaps(address)
      .then((borrowCap: EthersBigNumber) => {
        return {
          borrowCap: new BigNumber(borrowCap.toString()).shiftedBy(
            -DECIMALS[token]
          ),
          token,
        };
      });
  });

  return Promise.all(marketBorrowCapPromises).then((borrowCaps) => {
    return {
      data: Object.assign(
        {},
        ...borrowCaps.map(({ borrowCap, token }) => ({
          [token]: borrowCap.toString(),
        }))
      ),
    };
  });
};

export default getMarketBorrowCaps;
