import { useMutation, MutationObserverOptions } from 'react-query';
import { VBep20 } from 'types/contracts';
import { VTokenId } from 'types';
import queryClient from 'clients/api/queryClient';
import supply, { ISupplyNonBnbInput, SupplyNonBnbOutput } from 'clients/api/mutations/supplyNonBnb';

import FunctionKey from 'constants/functionKey';
import { useVTokenContract } from 'clients/contracts/hooks';
import { widgetBridge } from '@romeblockchain/bridge';
import { useWeb3React } from '@romeblockchain/wallet';
import { getVBepToken } from 'utilities';

export type SupplyNonBnbParams = Omit<ISupplyNonBnbInput, 'tokenContract' | 'account'>;

const useSupply = (
  { assetId, account }: { assetId: VTokenId; account: string },
  // TODO: use custom error type https://app.clickup.com/t/2rvwhnt
  options?: MutationObserverOptions<SupplyNonBnbOutput, Error, SupplyNonBnbParams>,
) => {
  const tokenContract = useVTokenContract<VTokenId>(assetId);

  const vBepTokenAddress = getVBepToken(assetId).address;
  const { chainId } = useWeb3React();
  return useMutation(
    [FunctionKey.SUPPLY, assetId],
    params =>
      supply({
        tokenContract: tokenContract as VBep20,
        account,
        ...params,
      }),
    {
      ...options,
      onSuccess: (...onSuccessParams) => {
        if (account && chainId && options?.variables?.amountWei) {
          widgetBridge.sendAnalyticsTxEvent('Venus_Supply_Non_BNB_Event', {
            user_address: account,
            chain_id: chainId.toString(),
            token_address: vBepTokenAddress,
            token_amount_w_decimals: options.variables.amountWei.toString(),
          });
        }
        queryClient.invalidateQueries(FunctionKey.GET_V_TOKEN_BALANCES_ALL);
        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useSupply;
