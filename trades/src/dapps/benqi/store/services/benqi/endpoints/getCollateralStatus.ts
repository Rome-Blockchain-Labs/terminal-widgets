import { TOKEN_QI_PAIRS, TOKENS } from '../../../../constants';
import { ContractAddresses } from '../../../../types';
import { getComptroller } from '../../../../utils';
import getAccount from '../../../../utils/getAccount';

const getCollateralStatus = async (contractAddresses: ContractAddresses) => {
  const account = await getAccount();
  const comptroller = await getComptroller(contractAddresses.Comptroller);

  return comptroller.getAssetsIn(account).then((tokens: string[]) => {
    const collateralStatus = Object.assign(
      {},
      ...TOKENS.map((token) => {
        const address = contractAddresses[TOKEN_QI_PAIRS[token]];
        return {
          [token]: tokens.includes(address),
        };
      })
    );

    return {
      data: collateralStatus,
    };
  });
};

export default getCollateralStatus;
