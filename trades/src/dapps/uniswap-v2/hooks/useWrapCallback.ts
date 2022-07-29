import {
  Currency,
  currencyEquals,
  WETH,
} from '@rbl/velox-common/uniV2ClonesSDK';
import { useContext, useMemo } from 'react';

import { getNativeTokenFromNetworkName } from '../../../constants/networkExchange';
import { DappContext } from '../../../contexts';
import { useWallets } from '../../../contexts/WalletsContext/WalletContext';
import { useWETHContract } from '../../../hooks';
import { tryParseAmount } from '../state/swap/hooks';
import { useTransactionAdder } from '../state/transactions/hooks';
import { useCurrencyBalance } from '../state/wallet/hooks';

export enum WrapType {
  NOT_APPLICABLE,
  WRAP,
  UNWRAP,
}

const NOT_APPLICABLE = { wrapType: WrapType.NOT_APPLICABLE };
/**
 * Given the selected input and output currency, return a wrap callback
 * @param inputCurrency the selected input currency
 * @param outputCurrency the selected output currency
 * @param typedValue the user input value
 */
export default function useWrapCallback(
  inputCurrency: Currency | undefined,
  outputCurrency: Currency | undefined,
  typedValue: string | undefined
): {
  wrapType: WrapType;
  execute?: undefined | (() => Promise<void>);
  inputError?: string;
} {
  const { account, chainId } = useWallets();
  const wethContract = useWETHContract();
  const { network } = useContext(DappContext);
  const nativeCurrencySymbol = getNativeTokenFromNetworkName(network)?.symbol;
  const balance = useCurrencyBalance(account ?? undefined, inputCurrency);
  // we can always parse the amount typed as the input currency, since wrapping is 1:1
  const inputAmount = useMemo(
    () => tryParseAmount(typedValue, inputCurrency),
    [inputCurrency, typedValue]
  );
  const addTransaction = useTransactionAdder();

  return useMemo(() => {
    if (!wethContract || !chainId || !inputCurrency || !outputCurrency)
      return NOT_APPLICABLE;

    const sufficientBalance =
      inputAmount && balance && !balance.lessThan(inputAmount);

    if (
      inputCurrency?.symbol === nativeCurrencySymbol &&
      currencyEquals((WETH as any)[chainId], outputCurrency)
    ) {
      return {
        execute:
          sufficientBalance && inputAmount
            ? async () => {
                try {
                  const txReceipt = await wethContract.deposit({
                    value: `0x${inputAmount.raw.toString(16)}`,
                  });
                  addTransaction(txReceipt, {
                    summary: `Wrap ${inputAmount.toSignificant(
                      6
                    )} ${nativeCurrencySymbol} to W${nativeCurrencySymbol}`,
                  });
                } catch (error) {
                  console.error('Could not deposit', error);
                }
              }
            : undefined,
        inputError: sufficientBalance
          ? undefined
          : `Insufficient ${nativeCurrencySymbol} balance`,
        wrapType: WrapType.WRAP,
      };
    } else if (
      currencyEquals((WETH as any)[chainId], inputCurrency) &&
      outputCurrency?.symbol === nativeCurrencySymbol
    ) {
      return {
        execute:
          sufficientBalance && inputAmount
            ? async () => {
                try {
                  const txReceipt = await wethContract.withdraw(
                    `0x${inputAmount.raw.toString(16)}`
                  );
                  addTransaction(txReceipt, {
                    summary: `Unwrap ${inputAmount.toSignificant(
                      6
                    )} W${nativeCurrencySymbol} to ${nativeCurrencySymbol}`,
                  });
                } catch (error) {
                  console.error('Could not withdraw', error);
                }
              }
            : undefined,
        inputError: sufficientBalance
          ? undefined
          : `Insufficient W${nativeCurrencySymbol} balance`,
        wrapType: WrapType.UNWRAP,
      };
    } else {
      return NOT_APPLICABLE;
    }
  }, [
    wethContract,
    chainId,
    inputCurrency,
    outputCurrency,
    inputAmount,
    balance,
    addTransaction,
    nativeCurrencySymbol,
  ]);
}
