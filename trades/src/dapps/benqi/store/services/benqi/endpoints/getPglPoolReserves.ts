import BigNumber from 'bignumber.js';
import { BigNumber as EthersBigNumber } from 'ethers';

import { ABI } from '../../../../constants';
import { ContractAddresses } from '../../../../types';
import { getContract } from '../../../../utils';
import getAccount from '../../../../utils/getAccount';
import getProvider from '../../../../utils/getProvider';

const getPglPoolReserves = async (contractAddresses: ContractAddresses) => {
  const account = await getAccount();
  const provider = await getProvider();

  const pglContract = getContract(
    contractAddresses.QiAvaxPgl,
    ABI.PangolinPair,
    provider,
    account
  );

  return pglContract
    .getReserves()
    .then(([reserve0Response, reserve1Response]: EthersBigNumber[]) => {
      const qiReserve = new BigNumber(reserve0Response.toString()).shiftedBy(
        -18
      );
      const avaxReserve = new BigNumber(reserve1Response.toString()).shiftedBy(
        -18
      );

      return {
        data: {
          avax: avaxReserve.toString(),
          qi: qiReserve.toString(),
        },
      };
    });
};

export default getPglPoolReserves;
