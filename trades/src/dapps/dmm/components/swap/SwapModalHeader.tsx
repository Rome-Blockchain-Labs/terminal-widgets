import 'twin.macro';

import { Currency, TradeType } from '@dynamic-amm/sdk';
import React, { useMemo } from 'react';
import { AlertTriangle, ArrowDown } from 'react-feather';

import { Field } from '../../state/swap/actions';
import { isAddress, shortenAddress } from '../../utils';
import { Aggregator } from '../../utils/aggregator';
import { useCurrencyConvertedToNative } from '../../utils/dmm';
import { computeSlippageAdjustedAmounts } from '../../utils/prices';
import { ButtonPrimary } from '../Button';
import { AutoColumn } from '../Column';
import CurrencyLogo from '../CurrencyLogo';
import { RowBetween, RowFixed } from '../Row';
import { SwapShowAcceptChanges } from './styleds';

export default function SwapModalHeader({
  allowedSlippage,
  onAcceptChanges,
  recipient,
  showAcceptChanges,
  trade,
}: {
  trade: Aggregator;
  allowedSlippage: number;
  recipient: string | null;
  showAcceptChanges: boolean;
  onAcceptChanges: () => void;
}) {
  const slippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(trade, allowedSlippage),
    [trade, allowedSlippage]
  );

  const nativeInput = useCurrencyConvertedToNative(
    trade.inputAmount.currency as Currency
  );

  const nativeOutput = useCurrencyConvertedToNative(
    trade.outputAmount.currency as Currency
  );
  return (
    <AutoColumn gap={'md'} style={{ marginTop: '20px' }}>
      <RowBetween align="flex-end">
        <RowFixed gap={'0px'}>
          <CurrencyLogo
            currency={trade.inputAmount.currency}
            size={'24px'}
            style={{ marginRight: '12px' }}
          />
          <span tw="text-xl font-medium">
            {trade.inputAmount.toSignificant(6)}
          </span>
        </RowFixed>
        <RowFixed gap={'0px'}>
          <span tw="text-xl font-medium ml-2">{nativeInput?.symbol}</span>
        </RowFixed>
      </RowBetween>
      <RowFixed>
        <ArrowDown size="16" style={{ marginLeft: '4px', minWidth: '16px' }} />
      </RowFixed>
      <RowBetween align="flex-end">
        <RowFixed gap={'0px'}>
          <CurrencyLogo
            currency={trade.outputAmount.currency}
            size={'24px'}
            style={{ marginRight: '12px' }}
          />
          <span tw="text-xl font-medium">
            {trade.outputAmount.toSignificant(6)}
          </span>
        </RowFixed>
        <RowFixed gap={'0px'}>
          <span tw="text-xl font-medium ml-2">{nativeOutput?.symbol}</span>
        </RowFixed>
      </RowBetween>
      {showAcceptChanges ? (
        <SwapShowAcceptChanges gap={'0px'} justify="flex-start">
          <RowBetween>
            <RowFixed>
              <AlertTriangle
                size={20}
                style={{ marginRight: '8px', minWidth: 24 }}
              />
              <span tw="font-extrabold text-xl"> Price Updated</span>
            </RowFixed>
            <ButtonPrimary
              style={{
                borderRadius: '12px',
                fontSize: '0.825rem',
                padding: '.5rem',
                width: 'fit-content',
              }}
              onClick={onAcceptChanges}
            >
              Accept
            </ButtonPrimary>
          </RowBetween>
        </SwapShowAcceptChanges>
      ) : null}
      <AutoColumn
        gap="sm"
        justify="flex-start"
        style={{ padding: '12px 0 0 0px' }}
        tw="text-xl"
      >
        {trade.tradeType === TradeType.EXACT_INPUT ? (
          <span>
            {'Output is estimated. You will receive at least '}{' '}
            <b>
              {slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(6)}{' '}
              {nativeOutput?.symbol}
            </b>{' '}
            {' or the transaction will revert.'}
          </span>
        ) : (
          <span>
            {'Input is estimated. You will sell at most '}
            <b>
              {slippageAdjustedAmounts[Field.INPUT]?.toSignificant(6)}{' '}
              {nativeInput?.symbol}
            </b>
            {' or the transaction will revert.'}
            {' or the transaction will revert.'}
          </span>
        )}
      </AutoColumn>
      {recipient !== null ? (
        <AutoColumn
          gap="sm"
          justify="flex-start"
          style={{ padding: '12px 0 0 0px' }}
        >
          <span tw="text-xl font-bold">
            Output will be sent to{' '}
            <b title={recipient}>
              {isAddress(recipient) ? shortenAddress(recipient) : recipient}
            </b>
          </span>
        </AutoColumn>
      ) : null}
    </AutoColumn>
  );
}
