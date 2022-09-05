import {
  ChainId,
  Currency,
  currencyEquals,
  ETHER,
  Token,
} from '@dynamic-amm/sdk';
import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';

import { SUGGESTED_BASES } from '../../constants';
import { convertToNativeTokenFromETH } from '../../utils/dmm';
import CurrencyLogo from '../CurrencyLogo';
import QuestionHelper from '../QuestionHelper';

const BaseWrapper = styled.div<{ disable?: boolean }>`
  border-radius: 10px;
  display: flex;
  padding: 6px;
  width: 100px;
  ${tw`border border-gray-300 mb-1.5`}

  align-items: center;
  :hover {
    cursor: ${({ disable }) => !disable && 'pointer'};
  }

  opacity: ${({ disable }) => disable && '0.4'};
`;

export default function CommonBases({
  chainId,
  onSelect,
  selectedCurrency,
}: {
  chainId?: ChainId;
  selectedCurrency?: Currency | null;
  onSelect: (currency: Currency) => void;
}) {
  return (
    <div tw="w-64">
      <div tw="flex items-center text-green-400 border-b border-gray-400 w-fit-content pb-2 mb-2">
        <span tw="text-xl font-medium">COMMON BASES</span>
        <QuestionHelper
          text={'These tokens are commonly paired with other tokens.'}
        />
      </div>
      <div>
        <BaseWrapper
          disable={selectedCurrency === ETHER}
          onClick={() => {
            if (!selectedCurrency || !currencyEquals(selectedCurrency, ETHER)) {
              onSelect(ETHER);
            }
          }}
        >
          <CurrencyLogo currency={ETHER} style={{ marginRight: 8 }} />
          <span tw="text-xl font-bold">
            {chainId && [1, 3, 4, 5, 42].includes(chainId) && 'ETH'}
            {chainId && [137, 80001].includes(chainId) && 'MATIC'}
            {chainId && [97, 56].includes(chainId) && 'BNB'}
            {chainId && [43113, 43114].includes(chainId) && 'AVAX'}
            {chainId && [250].includes(chainId) && 'FTM'}
          </span>
        </BaseWrapper>
        {(chainId ? SUGGESTED_BASES[chainId] : []).map((token: Token) => {
          const selected =
            selectedCurrency instanceof Token &&
            selectedCurrency.address === token.address;
          let showWToken: Currency = token;
          if (chainId) {
            showWToken = convertToNativeTokenFromETH(token, chainId);
          }
          return (
            <BaseWrapper
              key={token.address}
              disable={selected}
              onClick={() => !selected && onSelect(showWToken)}
            >
              <CurrencyLogo currency={token} style={{ marginRight: 8 }} />
              <span tw="text-xl font-bold">{showWToken.symbol}</span>
            </BaseWrapper>
          );
        })}
      </div>
    </div>
  );
}
