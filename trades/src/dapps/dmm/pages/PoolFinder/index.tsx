import 'twin.macro';

import { Currency, ETHER, JSBI, Pair, TokenAmount } from '@dynamic-amm/sdk';
import { useWeb3React } from '@romeblockchain/wallet';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Plus } from 'react-feather';
import { Text } from 'rebass';

import { DmmContext, DmmPage } from '../../../../widgets/Dmm/DmmContext';
import { ButtonDropdownLight } from '../../components/Button';
import { LightCard } from '../../components/Card';
import { AutoColumn, ColumnCenter } from '../../components/Column';
import CurrencyLogo from '../../components/CurrencyLogo';
import { FindPoolTabs } from '../../components/NavigationTabs';
import { NarrowPositionCard } from '../../components/PositionCard';
import Row from '../../components/Row';
import CurrencySearchModal from '../../components/SearchModal/CurrencySearchModal';
import { PairState, usePair } from '../../data/Reserves';
import { usePairAdderByTokens } from '../../state/user/hooks';
import { useTokenBalances } from '../../state/wallet/hooks';
import { StyledInternalLink } from '../../theme';
import { currencyId } from '../../utils/currencyId';
import { useCurrencyConvertedToNative } from '../../utils/dmm';
import { wrappedCurrency } from '../../utils/wrappedCurrency';
import AppBody from '../AppBody';
import { Dots } from '../Pool/styleds';

enum Fields {
  TOKEN0 = 0,
  TOKEN1 = 1,
}

export default function PoolFinder() {
  const { account, chainId } = useWeb3React();

  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [activeField, setActiveField] = useState<number>(Fields.TOKEN1);

  const [currency0, setCurrency0] = useState<Currency | null>(ETHER);
  const [currency1, setCurrency1] = useState<Currency | null>(null);

  const { setCurrencyIdA, setCurrencyIdB, setPage } = useContext(DmmContext);

  const pairs: [PairState, Pair | null][] = usePair(
    currency0 ?? undefined,
    currency1 ?? undefined
  );
  const addPair = usePairAdderByTokens();
  useEffect(() => {
    if (pairs.length > 0) {
      const token0 = wrappedCurrency(currency0 || undefined, chainId);
      const token1 = wrappedCurrency(currency1 || undefined, chainId);
      if (!!(token0 && token1)) {
        addPair(token0, token1);
      }
    }
  }, [pairs, addPair, currency0, currency1, chainId]);

  const positions: { [tokenAddress: string]: TokenAmount | undefined } =
    useTokenBalances(
      account ?? undefined,
      pairs.map(([, pair]) => pair?.liquidityToken)
    );

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      if (activeField === Fields.TOKEN0) {
        setCurrency0(currency);
      } else {
        setCurrency1(currency);
      }
    },
    [activeField]
  );

  const myPairs = pairs
    .filter(([pairState, pair]) => {
      // const validPairNoLiquidity: boolean =
      //   pairState === PairState.NOT_EXISTS ||
      //   Boolean(
      //     pairState === PairState.EXISTS &&
      //       pair &&
      //       JSBI.equal(pair.reserve0.raw, JSBI.BigInt(0)) &&
      //       JSBI.equal(pair.reserve1.raw, JSBI.BigInt(0))
      //   )
      let hasPosition = false;
      if (
        pair &&
        pair.liquidityToken.address &&
        positions[pair.liquidityToken.address]
      ) {
        hasPosition = Boolean(
          positions[pair.liquidityToken.address] &&
            JSBI.greaterThan(
              (positions[pair.liquidityToken.address] as TokenAmount).raw,
              JSBI.BigInt(0)
            )
        );
      }
      return pairState === PairState.EXISTS && hasPosition && pair;
    })
    .map(
      ([_, pair], index) =>
        !!pair && (
          <NarrowPositionCard
            key={index}
            border="1px solid #CED0D9"
            pair={pair}
          />
        )
    );

  const handleSearchDismiss = useCallback(() => {
    setShowSearch(false);
  }, [setShowSearch]);

  const prerequisiteMessage = (
    <div tw="text-xl p-5 bg-dark-400 rounded-lg">
      <Text textAlign="center">
        {!account
          ? 'Connect to a wallet to find pools'
          : 'Select a token to find your liquidity.'}
      </Text>
    </div>
  );

  const native0 = useCurrencyConvertedToNative(currency0 || undefined);
  const native1 = useCurrencyConvertedToNative(currency1 || undefined);

  return (
    <AppBody>
      <div tw="w-full flex justify-center">
        <div tw="max-w-sm w-full bg-green-700 rounded-lg my-auto p-4">
          <FindPoolTabs />
          <AutoColumn gap="md">
            <ButtonDropdownLight
              onClick={() => {
                setShowSearch(true);
                setActiveField(Fields.TOKEN0);
              }}
            >
              {native0 ? (
                <Row>
                  <CurrencyLogo currency={currency0 || undefined} />
                  <span tw="ml-1 text-xl font-medium">{native0?.symbol}</span>
                </Row>
              ) : (
                <span tw="text-xl font-medium">Select a Token</span>
              )}
            </ButtonDropdownLight>

            <ColumnCenter>
              <Plus color="#888D9B" size="16" />
            </ColumnCenter>

            <ButtonDropdownLight
              onClick={() => {
                setShowSearch(true);
                setActiveField(Fields.TOKEN1);
              }}
            >
              {native1 ? (
                <Row>
                  <CurrencyLogo currency={currency1 || undefined} />
                  <span tw="ml-1 text-xl font-medium">{native1?.symbol}</span>
                </Row>
              ) : (
                <span tw="text-xl font-medium">Select a Token</span>
              )}
            </ButtonDropdownLight>
            {/* <StyledInternalLink
              to={`/pools/${
                !!currency0 ? currencyId(currency0, chainId) : undefined
              }/${!!currency1 ? currencyId(currency1, chainId) : undefined}`}
            > */}
            <div
              tw="text-center text-green-400 hover:text-green-300 cursor-pointer"
              onClick={() => {
                setPage(DmmPage.POOLS);
                setCurrencyIdA(
                  currency0 ? currencyId(currency0, chainId) : undefined
                );
                setCurrencyIdB(
                  currency1 ? currencyId(currency1, chainId) : undefined
                );
              }}
            >
              <span tw=" text-xl text-center w-full mb-2">ADD LIQUIDITY</span>
            </div>
            {/* </StyledInternalLink> */}
            {pairs.filter(([pairState]) => pairState === PairState.LOADING)
              .length > 0 && (
              <LightCard padding="45px 10px">
                <AutoColumn gap="sm" justify="center">
                  <Text textAlign="center">
                    Loading
                    <Dots />
                  </Text>
                </AutoColumn>
              </LightCard>
            )}

            {currency0 && currency1
              ? myPairs.length > 0 && (
                  <>
                    <ColumnCenter
                      style={{
                        backgroundColor: '',
                        borderRadius: '12px',
                        justifyItems: 'center',
                        padding: '12px 0px',
                      }}
                    >
                      <Text fontWeight={500} textAlign="center">
                        Pool Found!
                      </Text>
                      <StyledInternalLink to={'/myPools'}>
                        <Text textAlign="center">Manage your pools.</Text>
                      </StyledInternalLink>
                    </ColumnCenter>
                    {myPairs}
                  </>
                )
              : prerequisiteMessage}
          </AutoColumn>

          <CurrencySearchModal
            showCommonBases
            isOpen={showSearch}
            selectedCurrency={
              (activeField === Fields.TOKEN0 ? currency1 : currency0) ??
              undefined
            }
            onCurrencySelect={handleCurrencySelect}
            onDismiss={handleSearchDismiss}
          />
        </div>
      </div>
    </AppBody>
  );
}
