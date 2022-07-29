import {
  ChainId,
  Currency,
  CurrencyAmount,
  TokenAmount,
} from '@dynamic-amm/sdk';
import React, { useEffect, useMemo, useRef } from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';
import { Flex, Text } from 'rebass';
import styled, { css } from 'styled-components';

import { useWallets } from '../../../../contexts/WalletsContext/WalletContext';
import { useAllTokens } from '../../hooks/Tokens';
import useThrottle from '../../hooks/useThrottle';
import { Field } from '../../state/swap/actions';
import { formattedNum, getEtherscanLink } from '../../utils';
import {
  getTradeComposition,
  SwapRouteV2,
} from '../../utils/aggregationRouting';
import { Aggregator, getExchangeConfig } from '../../utils/aggregator';
import { useCurrencyConvertedToNative } from '../../utils/dmm';
import CurrencyLogo from '../CurrencyLogo';

const StyledContainer = styled.div`
  flex: 1;
  max-width: 100%;
  margin-left: 0;
  overflow-y: scroll;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 999px;
  }
  &:hover::-webkit-scrollbar-thumb {
    border-radius: 999px;
  }
  &::-webkit-scrollbar-track-piece {
    background: transparent;
  }
`;

const StyledPair = styled.div`
  position: relative;
  padding-top: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledPairLine = styled.div`
  flex: auto;
  min-width: 50px;

  height: 1px;
`;
const StyledWrapToken = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 100px;
  width: max-content;
  font-size: 16px;
  font-weight: 500;
  white-space: nowrap;
  min-height: 38px;
  border-radius: 0.5rem;
`;
const StyledToken = styled.a<{ reverse?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  white-space: nowrap;
  text-decoration: none;
  color: inherit;
  ${({ reverse }) =>
    reverse &&
    css`
      flex-direction: row-reverse;
      justify-content: flex-start;
    `}

  & > span {
    margin-left: 4px;
    margin-right: 4px;
  }
`;
const StyledRoutes = styled.div`
  margin: auto;
  width: 100%;
  position: relative;
  padding: 20px 10px 0;

  &:before {
    position: absolute;
    display: block;
    content: '';
    top: 0;
    right: 0;
  }
`;
const StyledRoute = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  align-items: center;

  &:before,
  &:after {
    content: '';
    display: block;
    width: 100%;
    height: calc(50% + 20px);
    position: absolute;
    box-sizing: border-box;
    pointer-events: none;
  }

  &:before {
    top: -20px;
  }

  &:after {
    bottom: -10px;
  }

  &:last-child:after {
    display: none;
  }
`;
const StyledRouteLine = styled.div`
  position: absolute;

  width: 100%;
`;
const StyledHops = styled.div<{ length: string | number }>`
  width: 100%;
  z-index: 1;
  display: grid;
  grid-column-gap: 20px;
  grid-template-columns: repeat(${({ length }) => length}, 1fr);
  align-items: center;
`;

const StyledHop = styled.div`
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  height: fit-content;
  position: relative;
`;
const StyledExchange = styled.a`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 4px;
  margin-top: 4px;
  font-size: 10px;
  border-radius: 8px;

  line-height: 20px;
  white-space: nowrap;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  & > .img--sm {
    width: 14px;
    height: 14px;
    border-radius: 100%;
    margin-right: 4px;
  }

  &:first-child {
    margin-top: 8px;
  }
`;
const StyledExchangeStatic = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 4px;
  margin-top: 4px;
  font-size: 10px;
  border-radius: 8px;

  line-height: 20px;
  white-space: nowrap;
  text-decoration: none;

  & > .img--sm {
    width: 14px;
    height: 14px;
    border-radius: 100%;
    margin-right: 4px;
  }

  &:first-child {
    margin-top: 8px;
  }
`;

const StyledPercent = styled.div`
  font-size: 12px;
  line-height: 14px;
  font-weight: 700;
  position: absolute;
  top: calc(50% - 15px);
  left: 8px;
  transform: translateY(50%);
  z-index: 2;
`;
const StyledDot = styled.i<{ out?: boolean }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 100%;
  position: absolute;
  top: 0;
  left: ${({ out }) => (out ? 'unset' : '6.5px')};
  right: ${({ out }) => (out ? '6.5px' : 'unset')};
  z-index: 1;
`;
const StyledWrap = styled.div`
  width: calc(100% - 76px);
  margin: 10px 0 10px 6px;

  &.left-visible:after,
  &.right-visible:before {
    content: '';
    display: block;
    z-index: 2;
    pointer-events: none;
    position: absolute;
    inset: 0 0 auto auto;
    width: 40px;
    height: calc(100% - 20px);
    top: 50%;
    transform: translateY(-50%);
  }

  &.left-visible:after {
    left: 35px;
  }

  &.right-visible:before {
    right: 35px;
  }
`;

const StyledHopChevronRight = styled.div`
  position: absolute;
  left: -13px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
`;

const getSwapPercent = (percent?: number, routeNumber = 0): string | null => {
  if (routeNumber === 1) {
    return '100%';
  }
  if (!percent && percent !== 0) {
    return null;
  }
  const val =
    routeNumber > 1 ? Math.min(99.99, Math.max(0.01, percent)) : percent;
  return `${val.toFixed(0)}%`;
};

interface RouteRowProps {
  route: SwapRouteV2;
  chainId: ChainId;
}

const RouteRow = ({ chainId, route }: RouteRowProps) => {
  const scrollRef = useRef(null);
  const contentRef: any = useRef(null);
  const shadowRef: any = useRef(null);

  const handleShadow = useThrottle(() => {
    const element: any = scrollRef.current;
    if (element?.scrollLeft > 0) {
      shadowRef.current?.classList.add('left-visible');
    } else {
      shadowRef.current?.classList.remove('left-visible');
    }

    if (
      contentRef.current?.scrollWidth - element?.scrollLeft >
      element?.clientWidth
    ) {
      shadowRef.current?.classList.add('right-visible');
    } else {
      shadowRef.current?.classList.remove('right-visible');
    }
  }, 300);

  useEffect(() => {
    window.addEventListener('resize', handleShadow);
    return () => window.removeEventListener('resize', handleShadow);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    handleShadow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);

  return (
    <StyledWrap ref={shadowRef}>
      <ScrollContainer
        innerRef={scrollRef}
        vertical={false}
        onScroll={handleShadow}
      >
        <StyledHops ref={contentRef} length={route?.subRoutes?.length}>
          {route.subRoutes.map((subRoute, index) => {
            const token = route.path[index + 1];

            return (
              <StyledHop key={index}>
                {index !== 0 ? <StyledHopChevronRight /> : null}
                <StyledToken
                  href={getEtherscanLink(chainId, token?.address, 'token')}
                  style={{ marginRight: 0 }}
                  target="_blank"
                >
                  <CurrencyLogo currency={token} size={'16px'} />
                  <span>{token?.symbol}</span>
                </StyledToken>
                {Array.isArray(subRoute)
                  ? subRoute.map((pool) => {
                      const dex = getExchangeConfig(pool.exchange, chainId);
                      const link = ((i) => {
                        return pool.id.length === 42 ? (
                          <StyledExchange
                            key={`${i}-${pool.id}`}
                            href={getEtherscanLink(chainId, pool.id, 'address')}
                            target="_blank"
                          >
                            {i}
                          </StyledExchange>
                        ) : (
                          <StyledExchangeStatic key={`${i}-${pool.id}`}>
                            {i}
                          </StyledExchangeStatic>
                        );
                      })(
                        <>
                          {dex.icon ? (
                            <img alt="" className="img--sm" src={dex.icon} />
                          ) : (
                            <i className="img--sm" />
                          )}
                          {`${dex?.name || '--'}: ${pool.swapPercentage}%`}
                        </>
                      );
                      return link;
                    })
                  : null}
              </StyledHop>
            );
          })}
        </StyledHops>
      </ScrollContainer>
    </StyledWrap>
  );
};

interface RoutingProps {
  trade?: Aggregator;
  currencies: { [field in Field]?: Currency };
  parsedAmounts: {
    [Field.INPUT]: CurrencyAmount | undefined;
    [Field.OUTPUT]: CurrencyAmount | undefined;
  };
}

const Routing = ({ currencies, parsedAmounts, trade }: RoutingProps) => {
  const { chainId } = useWallets();

  const nativeInputCurrency = useCurrencyConvertedToNative(
    currencies[Field.INPUT] || undefined
  );
  const nativeOutputCurrency = useCurrencyConvertedToNative(
    currencies[Field.OUTPUT] || undefined
  );

  const allTokens = useAllTokens();

  const tradeComposition = useMemo((): SwapRouteV2[] | undefined => {
    return getTradeComposition(trade, chainId, allTokens);
  }, [trade, chainId, allTokens]);

  const renderTokenInfo = (
    currencyAmount: CurrencyAmount | undefined,
    field: Field
  ) => {
    const isOutput = field === Field.OUTPUT;
    const currency =
      currencyAmount instanceof TokenAmount
        ? currencyAmount.currency
        : isOutput
        ? nativeOutputCurrency
        : nativeInputCurrency;

    if (!currencyAmount) {
      return (
        <Flex flexDirection={isOutput ? 'row-reverse' : 'row'} width="100%">
          {currency && <CurrencyLogo currency={currency} size={'20px'} />}
          <Text marginX="0.5rem">
            {currency
              ? `${formattedNum(
                  parsedAmounts[field]?.toSignificant(6) ?? '0.0'
                )} ${currency.symbol}`
              : 'Select a token'}
          </Text>
        </Flex>
      );
    }

    if (chainId && currency) {
      return (
        <StyledToken as={'div'} reverse={isOutput}>
          <CurrencyLogo currency={currency} size={'20px'} />
          <span>{`${formattedNum(currencyAmount.toSignificant(6))} ${
            currency.symbol
          }`}</span>
        </StyledToken>
      );
    }
    return null;
  };

  const hasRoutes =
    trade && chainId && tradeComposition && tradeComposition.length > 0;

  return (
    <StyledContainer>
      <StyledPair>
        <StyledWrapToken>
          {renderTokenInfo(trade?.inputAmount, Field.INPUT)}
        </StyledWrapToken>
        {!hasRoutes && <StyledPairLine />}
        <StyledWrapToken>
          {renderTokenInfo(trade?.outputAmount, Field.OUTPUT)}
        </StyledWrapToken>
      </StyledPair>

      {trade && chainId && tradeComposition && tradeComposition.length > 0 ? (
        <div>
          <StyledRoutes>
            <StyledDot />
            <StyledDot out />
            {tradeComposition.map((route, index) => (
              <StyledRoute key={index}>
                <StyledPercent>
                  {getSwapPercent(
                    route.swapPercentage,
                    tradeComposition.length
                  )}
                </StyledPercent>
                <StyledRouteLine />
                <RouteRow chainId={chainId} route={route} />
              </StyledRoute>
            ))}
          </StyledRoutes>
        </div>
      ) : null}
    </StyledContainer>
  );
};

export default Routing;
