import { BigNumber as EthersBigNumber } from '@ethersproject/bignumber/lib/bignumber';
import BigNumber from 'bignumber.js';

import { ABI, DECIMALS, TOKEN_QI_PAIRS, TOKENS } from '../../../../constants';
import { ContractAddresses, Token } from '../../../../types';
import { getComptroller, getContract } from '../../../../utils';
import getAccount from '../../../../utils/getAccount';
import getProvider from '../../../../utils/getProvider';

const getPrices = async (contractAddresses: ContractAddresses) => {
  const provider = await getProvider();
  const account = await getAccount();
  const comptroller = await getComptroller(contractAddresses.Comptroller);
  const oracleAddress = await comptroller.oracle();

  const oracle = getContract(oracleAddress, ABI.PriceOracle, provider, account);

  const pricePromises = TOKENS.map((token) => {
    const address = contractAddresses[TOKEN_QI_PAIRS[token]];
    return oracle
      .getUnderlyingPrice(address)
      .then((price: EthersBigNumber) => {
        return {
          price: new BigNumber(price.toString()).shiftedBy(
            -(36 - DECIMALS[token])
          ),
          token,
        };
      })
      .catch(() => {
        return {
          price: new BigNumber(0),
          token,
        };
      });
  });

  return Promise.all(pricePromises).then(
    (prices: { token: Token; price: BigNumber }[]) => {
      return {
        data: Object.assign(
          {},
          ...prices.map(({ price, token }) => ({
            [token]: price.toString(),
          }))
        ),
      };
    }
  );
};

export default getPrices;
