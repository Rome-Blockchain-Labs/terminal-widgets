import { MutationObserverOptions, useMutation } from 'react-query';

import { queryClient, borrowVToken, IBorrowVTokenInput, BorrowVTokenOutput } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { VTokenId } from 'types';
import { useVTokenContract } from 'clients/contracts/hooks';
import { useWeb3React } from '@romeblockchain/wallet';
import { widgetBridge } from '@romeblockchain/bridge';
import { getVBepToken } from 'utilities';

type Options = MutationObserverOptions<
  BorrowVTokenOutput,
  Error,
  Omit<IBorrowVTokenInput, 'vTokenContract'>
>;

const useBorrowVToken = ({ vTokenId }: { vTokenId: VTokenId }, options?: Options) => {
  const { account, chainId } = useWeb3React();
  const vTokenContract = useVTokenContract(vTokenId);

  const vBepTokenAddress = getVBepToken(vTokenId).address;
  return useMutation(
    FunctionKey.BORROW_V_TOKEN,
    params =>
      borrowVToken({
        vTokenContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: (...onSuccessParams) => {
        if (account && chainId && options?.variables?.amountWei) {
          widgetBridge.sendAnalyticsTxEvent('Venus_Borrow_Event', {
            user_address: account,
            chain_id: chainId.toString(),
            token_address: vBepTokenAddress,
            token_amount_w_decimals: options.variables.amountWei.toString(),
          });
        }
        queryClient.invalidateQueries(FunctionKey.GET_V_TOKEN_BALANCES_ALL);
        queryClient.invalidateQueries(FunctionKey.GET_ASSETS_IN_ACCOUNT);
        queryClient.invalidateQueries(FunctionKey.GET_MARKETS);
        queryClient.invalidateQueries([FunctionKey.GET_V_TOKEN_BORROW_BALANCE, vTokenId]);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useBorrowVToken;
