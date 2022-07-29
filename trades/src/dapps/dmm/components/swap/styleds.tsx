import React, { useState } from 'react';
import { Text } from 'rebass';
import styled, { css } from 'styled-components';
import tw from 'twin.macro';

import { ReactComponent as Alert } from '../../assets/images/alert.svg';
import { errorFriendly } from '../../utils/dmm';
import { AutoColumn } from '../Column';

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column-reverse;

  width: inherit;

  @media only screen and (min-width: 768px) {
    flex-direction: column;
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  gap: 28px;

  @media only screen and (min-width: 1000px) {
    flex-direction: row;
    align-items: flex-start;
    gap: 24px;
  }

  & > div:first-child {
    width: 100%;
  }
`;

export const Wrapper = styled.div`
  position: relative;
  z-index: 1;
`;

export const AggregatorStatsContainer = styled.div`
  width: 100%;

  margin: auto;
  display: flex;
  gap: 24px;
`;

export const AggregatorStatsItem = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  justify-content: center;
  align-items: center;
  padding: 12px 16px;
  border-radius: 4px;
`;

export const AggregatorStatsItemTitle = styled.span`
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 400;
`;

export const AggregatorStatsItemValue = styled.span`
  font-size: 16px;
  font-weight: 600;

  margin-left: 4px;
`;

export const ArrowWrapper = styled.div<{
  clickable: boolean;
  rotated?: boolean;
}>`
  padding: 2px;

  transform: rotate(${({ rotated }) => (rotated ? '180deg' : '0')});
  transition: transform 300ms;

  ${({ clickable }) =>
    clickable
      ? css`
          :hover {
            cursor: pointer;
            opacity: 0.8;
          }
        `
      : null}
`;

export const SectionBreak = styled.div`
  height: 1px;
  width: 100%;
`;

export const BottomGrouping = styled.div`
  ${tw`w-full flex`}
`;

export const ErrorText = styled(Text)<{ severity?: 0 | 1 | 2 | 3 | 4 }>``;

export const StyledBalanceMaxMini = styled.button`
  height: 22px;
  width: 22px;
  background-color: transparent;
  border: none;
  border-radius: 50%;
  padding: 0.2rem;
  font-size: 0.875rem;
  font-weight: 400;
  margin-left: 0.25rem;
  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;
  float: right;

  :hover {
  }
  :focus {
    outline: none;
  }
`;

export const TruncatedText = styled(Text)`
  text-overflow: ellipsis;
  width: 220px;
  overflow: hidden;
`;

// styles
export const Dots = styled.span`
  &::after {
    display: inline-block;
    animation: ellipsis 1.25s infinite;
    content: '.';
    width: 1em;
    text-align: left;
  }
  @keyframes ellipsis {
    0% {
      content: '.';
    }
    33% {
      content: '..';
    }
    66% {
      content: '...';
    }
  }
`;

const SwapCallbackErrorInner = styled.div`
  border-radius: 1rem;
  display: flex;
  align-items: center;
  font-size: 0.825rem;
  width: 100%;
  margin-top: 36px;
  padding: 8px 20px 8px 8px;
  z-index: -1;
  p {
    padding: 0;
    margin: 0;
    font-weight: 500;
  }
`;

export function SwapCallbackError({ error }: { error: string }) {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  return (
    <SwapCallbackErrorInner>
      <Alert style={{ marginBottom: 'auto' }} />
      <AutoColumn style={{ flexBasis: '100%', margin: '10px 0 auto 8px' }}>
        <Text fontSize="16px" fontWeight="500" lineHeight={'24px'}>
          {errorFriendly(error)}
        </Text>
        {error !== errorFriendly(error) && (
          <Text
            fontSize="12px"
            sx={{ cursor: 'pointer' }}
            onClick={() => setShowDetail(!showDetail)}
          >
            Show more details
          </Text>
        )}
        {showDetail && (
          <Text fontSize="10px" lineHeight={'16px'} margin={'10px 0 4px 0'}>
            {error}
          </Text>
        )}
      </AutoColumn>
    </SwapCallbackErrorInner>
  );
}

export const SwapShowAcceptChanges = styled(AutoColumn)`
  padding: 0.5rem;
  border-radius: 12px;
  margin-top: 8px;
`;

export const GroupButtonReturnTypes = styled.div`
  display: flex;
  border-radius: 999px;
  ${tw`bg-dark-600 p-1.5 w-full h-13`}
`;

export const ButtonReturnType = styled.div<{ active?: boolean }>`
  border-radius: 999px;
  flex: 1;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${tw`text-xl font-bold`}
  cursor: pointer;
  ${({ active }) => active && tw`bg-green-400 text-black`}
`;

export const SwapFormActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const KyberTag = styled.div`
  position: absolute;
  align-items: center;
  display: flex;
  top: 28px;
  left: 6px;
  font-weight: 500;
  border-bottom-right-radius: 0.25rem;
  border-top-left-radius: 0.25rem;
  padding: 0.375rem;

  font-size: 0.75rem;
  z-index: 2;
`;

export const PriceImpactHigh = styled.div<{ veryHigh?: boolean }>`
  border-radius: 4px;
  padding 12px 16px;
  
  margin-top: 28px;
  display: flex;
  align-items: center;
  font-size: 12px;
`;
