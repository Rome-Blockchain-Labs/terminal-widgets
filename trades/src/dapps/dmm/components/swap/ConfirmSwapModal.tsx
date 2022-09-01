import { Currency, currencyEquals } from '@dynamic-amm/sdk';
import React, { useCallback, useMemo } from 'react';
import { theme } from 'twin.macro';

import {
  ConfirmationModalContent,
  TransactionConfirmationModal,
  TransactionErrorContent,
} from '../../../../components/modals';
import { Aggregator } from '../../utils/aggregator';
import { useCurrencyConvertedToNative } from '../../utils/dmm';
import SwapModalFooter from './SwapModalFooter';
import SwapModalHeader from './SwapModalHeader';

/**
 * Returns true if the trade requires a confirmation of details before we can submit it
 * @param tradeA trade A
 * @param tradeB trade B
 */
function tradeMeaningfullyDiffers(
  tradeA: Aggregator,
  tradeB: Aggregator
): boolean {
  return (
    tradeA.tradeType !== tradeB.tradeType ||
    !currencyEquals(tradeA.inputAmount.currency, tradeB.inputAmount.currency) ||
    !tradeA.inputAmount.equalTo(tradeB.inputAmount) ||
    !currencyEquals(
      tradeA.outputAmount.currency,
      tradeB.outputAmount.currency
    ) ||
    !tradeA.outputAmount.equalTo(tradeB.outputAmount)
  );
}

export default function ConfirmSwapModal({
  allowedSlippage,
  attemptingTxn,
  isOpen,
  onAcceptChanges,
  onConfirm,
  onDismiss,
  originalTrade,
  recipient,
  swapErrorMessage,
  tokenAddtoMetaMask,
  trade,
  txHash,
}: {
  isOpen: boolean;
  trade: Aggregator | undefined;
  originalTrade: Aggregator | undefined;
  attemptingTxn: boolean;
  txHash: string | undefined;
  recipient: string | null;
  allowedSlippage: number;
  tokenAddtoMetaMask: Currency | undefined;
  onAcceptChanges: () => void;
  onConfirm: () => void;
  swapErrorMessage: string | undefined;
  onDismiss: () => void;
}) {
  const showAcceptChanges = useMemo(
    () =>
      Boolean(
        trade && originalTrade && tradeMeaningfullyDiffers(trade, originalTrade)
      ),
    [originalTrade, trade]
  );

  const modalHeader = useMemo(() => {
    return trade ? (
      <SwapModalHeader
        allowedSlippage={allowedSlippage}
        recipient={recipient}
        showAcceptChanges={showAcceptChanges}
        trade={trade}
        onAcceptChanges={onAcceptChanges}
      />
    ) : null;
  }, [allowedSlippage, onAcceptChanges, recipient, showAcceptChanges, trade]);

  const modalBottom = useMemo(() => {
    return trade ? (
      <SwapModalFooter
        allowedSlippage={allowedSlippage}
        disabledConfirm={showAcceptChanges}
        swapErrorMessage={swapErrorMessage}
        trade={trade}
        onConfirm={onConfirm}
      />
    ) : null;
  }, [allowedSlippage, onConfirm, showAcceptChanges, swapErrorMessage, trade]);

  const nativeInput = useCurrencyConvertedToNative(
    trade?.inputAmount?.currency
  );
  const nativeOutput = useCurrencyConvertedToNative(
    trade?.outputAmount?.currency
  );
  // text to show while loading
  const pendingText = `Swapping ${trade?.inputAmount?.toSignificant(6)} ${
    nativeInput?.symbol
  } for ${trade?.outputAmount?.toSignificant(6)} ${nativeOutput?.symbol}`;

  const confirmationContent = useCallback(
    () =>
      swapErrorMessage ? (
        <TransactionErrorContent
          message={swapErrorMessage}
          titleColor={theme`colors.green.400`}
          onDismiss={onDismiss}
        />
      ) : (
        <ConfirmationModalContent
          bottomContent={modalBottom}
          title={'CONFIRM SWAP'}
          titleColor={theme`colors.green.400`}
          topContent={modalHeader}
          onDismiss={onDismiss}
        />
      ),
    [onDismiss, modalBottom, modalHeader, swapErrorMessage]
  );

  return (
    <>
      <TransactionConfirmationModal
        noPadding
        attemptingTxn={attemptingTxn}
        content={confirmationContent}
        hash={txHash}
        isOpen={isOpen}
        pendingText={pendingText}
        titleColor={theme`colors.green.400`}
        onDismiss={onDismiss}
      />
    </>
  );
}
