import { JSBI, Pair, Token } from '@dynamic-amm/sdk';
import React, { useContext, useMemo, useState } from 'react';
import tw, { styled } from 'twin.macro';

import { useWallets } from '../../../../contexts/WalletsContext/WalletContext';
import { DmmContext, DmmPage } from '../../../../widgets/Dmm/DmmContext';
import Card from '../../components/Card';
import { AutoColumn } from '../../components/Column';
import { CardBGImage, CardNoise, DataCard } from '../../components/earn/styled';
import { SwapPoolTabs } from '../../components/NavigationTabs';
import FullPositionCard from '../../components/PositionCard';
import { AutoRow, RowBetween } from '../../components/Row';
import Search from '../../components/Search';
import { Dots } from '../../components/swap/styleds';
import { SwitchLocaleLink } from '../../components/SwitchLocaleLink';
import { BIG_INT_ZERO } from '../../constants';
import { usePairs, usePairsByAddress } from '../../data/Reserves';
import useDebounce from '../../hooks/useDebounce';
import {
  UserLiquidityPosition,
  useUserLiquidityPositions,
} from '../../state/pools/hooks';
import { useStakingInfo } from '../../state/stake/hooks';
import {
  useLiquidityPositionTokenPairs,
  useToV2LiquidityTokens,
} from '../../state/user/hooks';
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks';

export const PageWrapper = styled(AutoColumn)`
  padding: 16px 0 100px;
  width: 100%;
`;

const VoteCard = styled(DataCard)`
  background: radial-gradient(
    76.02% 75.41% at 1.84% 0%,
    #27ae60 0%,
    #000000 100%
  );
  overflow: hidden;
`;

const InstructionText = styled.div`
  ${tw`bg-green-700 text-xl text-white p-4`}
  width: 100%;
  border-radius: 5px;
  line-height: 1.5;
`;

const TitleRow = styled(RowBetween)``;

const EmptyProposals = styled.div`
  ${tw`border border-gray-300`}
  padding: 16px 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const PositionCardGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(320px, auto) minmax(320px, auto) minmax(
      320px,
      auto
    );
  gap: 24px;
  max-width: 1008px;
`;

export default function Pool() {
  const { account } = useWallets();

  const liquidityPositionTokenPairs = useLiquidityPositionTokenPairs();

  const { setPage } = useContext(DmmContext);

  //trackedTokenPairs = [ [Token, Token],  [Token, Token] ]
  const tokenPairsWithLiquidityTokens = useToV2LiquidityTokens(
    liquidityPositionTokenPairs
  );

  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityTokens),
    [tokenPairsWithLiquidityTokens]
  );
  const [v2PairsBalances, fetchingV2PairBalances] =
    useTokenBalancesWithLoadingIndicator(
      account ?? undefined,
      liquidityTokens.flatMap((x) => x)
    );
  // fetch the reserves for all V2 pools in which the user has a balance
  // const liquidityTokensWithBalances = useMemo(
  //   () =>
  //     tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
  //       v2PairsBalances[liquidityToken.address]?.greaterThan('0')
  //     ),
  //   [tokenPairsWithLiquidityTokens, v2PairsBalances]
  // )
  const liquidityTokensWithBalances = useMemo(
    () =>
      liquidityTokens.reduce<
        { liquidityToken: Token; tokens: [Token, Token] }[]
      >((acc, lpTokens, index) => {
        lpTokens
          .filter((lp: Token) => v2PairsBalances[lp.address]?.greaterThan('0'))
          .forEach((lp: Token) => {
            acc.push({
              liquidityToken: lp,
              tokens: tokenPairsWithLiquidityTokens[index].tokens,
            });
          });
        return acc;
      }, []),
    [tokenPairsWithLiquidityTokens, liquidityTokens, v2PairsBalances]
  );

  const v2Pairs = usePairsByAddress(
    liquidityTokensWithBalances.map(({ liquidityToken, tokens }) => ({
      address: liquidityToken.address,
      currencies: tokens,
    }))
  );
  const v2IsLoading =
    fetchingV2PairBalances ||
    v2Pairs?.length < liquidityTokensWithBalances.length ||
    v2Pairs?.some((V2Pair) => !V2Pair);
  const allV2PairsWithLiquidity = v2Pairs
    .map(([, pair]) => pair)
    .filter((v2Pair): v2Pair is Pair => Boolean(v2Pair));
  // const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebounce(searchText.trim().toLowerCase(), 200);

  // show liquidity even if its deposited in rewards contract
  const stakingInfo = useStakingInfo();
  const stakingInfosWithBalance = stakingInfo?.filter((pool) =>
    JSBI.greaterThan(pool.stakedAmount.raw, BIG_INT_ZERO)
  );
  const stakingPairs = usePairs(
    stakingInfosWithBalance?.map((stakingInfo) => stakingInfo.tokens)
  ).flatMap((x) => x);
  // // remove any pairs that also are included in pairs with stake in mining pool
  const v2PairsWithoutStakedAmount = allV2PairsWithLiquidity.filter(
    (v2Pair) => {
      return (
        (debouncedSearchText
          ? v2Pair.token0.symbol?.toLowerCase().includes(debouncedSearchText) ||
            v2Pair.token1.symbol?.toLowerCase().includes(debouncedSearchText) ||
            v2Pair.address.toLowerCase() === debouncedSearchText
          : true) &&
        stakingPairs
          ?.map((stakingPair) => stakingPair[1])
          .filter(
            (stakingPair) =>
              stakingPair?.liquidityToken.address ===
              v2Pair.liquidityToken.address
          ).length === 0
      );
    }
  );

  const {
    data: userLiquidityPositions,
    loading: loadingUserLiquidityPositions,
  } = useUserLiquidityPositions(account);

  const transformedUserLiquidityPositions: {
    [key: string]: UserLiquidityPosition;
  } = {};

  userLiquidityPositions?.liquidityPositions.forEach(
    (position: UserLiquidityPosition) => {
      transformedUserLiquidityPositions[position.pool.id] = position;
    }
  );

  return (
    <>
      <PageWrapper>
        <SwapPoolTabs active={'pool'} />
        <VoteCard>
          <CardBGImage />
          <CardNoise />
          <CardBGImage />
          <CardNoise />
        </VoteCard>

        <AutoColumn gap="lg" justify="center">
          <AutoColumn gap="lg" style={{ width: '100%' }}>
            <AutoRow>
              <InstructionText>
                Here you can view all your liquidity positions and add/remove
                more liquidity.
              </InstructionText>
            </AutoRow>

            <TitleRow padding={'0'} style={{ marginTop: '1rem' }}>
              <span tw="text-xl font-bold text-white">MY LIQUIDITY POOLS</span>

              <Search
                placeholder="Search by tokens or pool address"
                searchValue={searchText}
                setSearchValue={setSearchText}
              />
            </TitleRow>

            {!account ? (
              <Card padding="40px">
                <span>Connect to a wallet to view your liquidity.</span>
              </Card>
            ) : v2IsLoading || loadingUserLiquidityPositions ? (
              <EmptyProposals>
                <span tw="text-xl">
                  <Dots>Loading</Dots>
                </span>
              </EmptyProposals>
            ) : allV2PairsWithLiquidity?.length > 0 ||
              stakingPairs?.length > 0 ? (
              <PositionCardGrid>
                {v2PairsWithoutStakedAmount.map((v2Pair) => (
                  <FullPositionCard
                    key={v2Pair.liquidityToken.address}
                    myLiquidity={
                      transformedUserLiquidityPositions[
                        v2Pair.address.toLowerCase()
                      ]
                    }
                    pair={v2Pair}
                  />
                ))}
                {stakingPairs.map(
                  (stakingPair, i) =>
                    stakingPair[1] && ( // skip pairs that arent loaded
                      <FullPositionCard
                        key={stakingInfosWithBalance[i].stakingRewardAddress}
                        myLiquidity={
                          transformedUserLiquidityPositions[
                            stakingPair[1].address.toLowerCase()
                          ]
                        }
                        pair={stakingPair[1]}
                        stakedBalance={stakingInfosWithBalance[i].stakedAmount}
                      />
                    )
                )}
              </PositionCardGrid>
            ) : (
              <EmptyProposals>
                <span tw="text-xl">No liquidity found.</span>
              </EmptyProposals>
            )}

            <AutoColumn gap="md" justify={'center'}>
              <span tw="text-xl text-white py-0.5 text-center flex">
                Don't see a pool you joined?{' '}
                <div
                  id="import-pool-link"
                  tw="text-green-400 ml-1 cursor-pointer"
                  onClick={() => setPage(DmmPage.POOLFINDER)}
                >
                  IMPORT IT
                </div>
              </span>
            </AutoColumn>
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
      <SwitchLocaleLink />
    </>
  );
}
