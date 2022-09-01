import { currencyEquals, Trade } from '@rbl/velox-common/uniV2ClonesSDK';
import React, { useCallback, useMemo } from 'react';

import {
  ConfirmationModalContent,
  TransactionConfirmationModal,
  TransactionErrorContent,
} from '../../../../components/modals';
import { getDefaultCurrencySymbol } from '../../../../utils';
import SwapModalFooter from './SwapModalFooter';
import SwapModalHeader from './SwapModalHeader';

/**
 * Returns true if the trade requires a confirmation of details before we can submit it
 * @param tradeA trade A
 * @param tradeB trade B
 */
function tradeMeaningfullyDiffers(tradeA: Trade, tradeB: Trade): boolean {
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
  trade,
  txHash,
}: {
  isOpen: boolean;
  trade: Trade | undefined;
  originalTrade: Trade | undefined;
  attemptingTxn: boolean;
  txHash: string | undefined;
  recipient: string | null;
  allowedSlippage: number;
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

  // text to show while loading
  const pendingText = `Swapping ${trade?.inputAmount?.toSignificant(
    6
  )} ${getDefaultCurrencySymbol(
    trade?.inputAmount?.currency
  )} for ${trade?.outputAmount?.toSignificant(6)} ${getDefaultCurrencySymbol(
    trade?.outputAmount?.currency
  )}`;

  const confirmationContent = useCallback(
    () =>
      swapErrorMessage ? (
        <TransactionErrorContent
          message={swapErrorMessage}
          onDismiss={onDismiss}
        />
      ) : (
        <ConfirmationModalContent
          bottomContent={modalBottom}
          title="CONFIRM SWAP"
          topContent={modalHeader}
          onDismiss={onDismiss}
        />
      ),
    [onDismiss, modalBottom, modalHeader, swapErrorMessage]
  );

  return (
    <TransactionConfirmationModal
      attemptingTxn={attemptingTxn}
      content={confirmationContent}
      hash={txHash}
      isOpen={isOpen}
      pendingText={pendingText}
      onDismiss={onDismiss}
    />
  );
}
