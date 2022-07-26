import 'twin.macro';

import { Currency, TradeType } from '@dynamic-amm/sdk';
import React, { useMemo, useState } from 'react';
import { Repeat } from 'react-feather';

import { useWallets } from '../../../../contexts/WalletsContext/WalletContext';
import InfoHelper from '../../components/InfoHelper';
import { Field } from '../../state/swap/actions';
import { formattedNum } from '../../utils';
import { Aggregator } from '../../utils/aggregator';
import { useCurrencyConvertedToNative } from '../../utils/dmm';
import {
  computeSlippageAdjustedAmounts,
  formatExecutionPrice,
} from '../../utils/prices';
import { ButtonError } from '../Button';
import { AutoColumn } from '../Column';
import { AutoRow, RowBetween, RowFixed } from '../Row';
import { StyledBalanceMaxMini, SwapCallbackError } from './styleds';

export default function SwapModalFooter({
  allowedSlippage,
  disabledConfirm,
  onConfirm,
  swapErrorMessage,
  trade,
}: {
  trade: Aggregator;
  allowedSlippage: number;
  onConfirm: () => void;
  swapErrorMessage: string | undefined;
  disabledConfirm: boolean;
}) {
  const { chainId } = useWallets();
  const [showInverted, setShowInverted] = useState<boolean>(false);

  const slippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(trade, allowedSlippage),
    [allowedSlippage, trade]
  );

  const nativeInput = useCurrencyConvertedToNative(
    trade.inputAmount.currency as Currency
  );

  const nativeOutput = useCurrencyConvertedToNative(
    trade.outputAmount.currency as Currency
  );
  return (
    <>
      <AutoColumn
        gap="0.5rem"
        style={{
          borderRadius: '8px',
          padding: '1rem',
        }}
      >
        <RowBetween align="center">
          <span tw="text-xl">Current Price</span>
          <span tw="text-xl font-bold flex items-center">
            {/* <Text
            fontSize={14}
            fontWeight={500}
            style={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'center',
              paddingLeft: '10px',
              textAlign: 'right',
            }}
          > */}
            {formatExecutionPrice(trade, showInverted, chainId)}
            <StyledBalanceMaxMini
              onClick={() => setShowInverted(!showInverted)}
            >
              <Repeat size={12} />
            </StyledBalanceMaxMini>
          </span>
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <span tw="text-xl font-medium">
              {trade.tradeType === TradeType.EXACT_INPUT
                ? 'Minimum received'
                : 'Maximum sold'}
            </span>
            <InfoHelper
              size={14}
              text={
                'Minimum amount you will receive or your transaction will revert'
              }
            />
          </RowFixed>
          <RowFixed>
            <span tw="text-xl">
              {trade.tradeType === TradeType.EXACT_INPUT
                ? slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4) ?? '-'
                : slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4) ?? '-'}
            </span>
            <span tw="text-xl ml-1">
              {trade.tradeType === TradeType.EXACT_INPUT
                ? nativeOutput?.symbol
                : nativeInput?.symbol}
            </span>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <span tw="text-xl font-medium">Gas Fee</span>
            <InfoHelper
              size={14}
              text={'Estimated network fee for your transaction'}
            />
          </RowFixed>

          <span tw="text-xl">
            {formattedNum(trade.gasUsd?.toString(), true)}
          </span>
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <span tw="text-xl font-medium">Price Impact</span>
            <InfoHelper
              size={14}
              text={
                'Estimated change in price due to the size of your transaction'
              }
            />
          </RowFixed>
          <span tw="text-xl">
            {trade.priceImpact > 0.01 ? trade.priceImpact.toFixed(3) : '< 0.01'}
            %
          </span>
        </RowBetween>
      </AutoColumn>

      <AutoRow>
        <ButtonError
          disabled={disabledConfirm}
          id="confirm-swap-or-send"
          style={{
            ...(trade.priceImpact > 5 && {
              border: 'none',
            }),
          }}
          onClick={onConfirm}
        >
          <span tw="text-xl font-bold"> CONFIRM SWAP </span>
        </ButtonError>

        {swapErrorMessage ? (
          <SwapCallbackError error={swapErrorMessage} />
        ) : null}
      </AutoRow>
    </>
  );
}
