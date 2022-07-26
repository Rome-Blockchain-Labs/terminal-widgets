import { BigNumber as EthersBigNumber } from '@ethersproject/bignumber';
import BigNumber from 'bignumber.js';

import { DECIMALS, TOKEN_QI_PAIRS, TOKENS } from '../../../../constants';
import { ContractAddresses } from '../../../../types';
import { getQiContractFromToken } from '../../../../utils';

const getTotalSupply = async (contractAddresses: ContractAddresses) => {
  const totalSupplyPromises = TOKENS.map((token) => {
    return getQiContractFromToken(
      token,
      contractAddresses[TOKEN_QI_PAIRS[token]]
    )
      .then((qiContract) => qiContract.totalSupply())
      .then((totalSupply: EthersBigNumber) => {
        return {
          token,
          totalSupply: new BigNumber(totalSupply.toString()).shiftedBy(
            -DECIMALS[TOKEN_QI_PAIRS[token]]
          ),
        };
      });
  });

  return Promise.all(totalSupplyPromises).then((totalSupplyPerToken) => {
    return {
      data: Object.assign(
        {},
        ...totalSupplyPerToken.map(({ token, totalSupply }) => ({
          [token]: totalSupply.toString(),
        }))
      ),
    };
  });
};

export default getTotalSupply;
