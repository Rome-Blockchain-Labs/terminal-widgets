import { Pair } from '@rbl/velox-common/uniV2ClonesSDK';
import { useWeb3React } from '@romeblockchain/wallet';
import { FC, useMemo } from 'react';
import tw, { styled } from 'twin.macro';

import { ButtonPrimary, ButtonSecondary } from '../../../../components/buttons';
import Card from '../../../../components/card';
import { AutoColumn } from '../../../../components/column';
import { ExternalLink } from '../../../../components/links';
import { RowBetween, RowFixed } from '../../../../components/row';
import { CardSection, DataCard } from '../../components/Earn/styled';
import FullPositionCard from '../../components/PositionCard';
import { Dots } from '../../components/swap/styleds';
import { usePairs } from '../../data/Reserves';
import {
  toV2LiquidityToken,
  useTrackedTokenPairs,
} from '../../state/user/hooks';
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks';

const PageWrapper = styled(AutoColumn)`
  width: 100%;
  ${tw`bg-dark-400 px-10 pt-4 pb-16 max-w-xl rounded-xl`}
`;

const VoteCard = styled(DataCard)`
  overflow: hidden;
  background-image: none;
`;

const TitleRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
    flex-direction: column-reverse;
  `};
`;

const ButtonRow = styled(RowFixed)`
  gap: 8px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    flex-direction: row-reverse;
    justify-content: space-between;
  `};
`;

const ResponsiveButtonPrimary = styled(ButtonPrimary)`
  ${tw`text-base text-gray-300 w-fit-content font-medium my-2 bg-gray-500 px-5 py-2 rounded-lg hover:bg-dark-900 hover:text-yellow-400 hover:border-yellow-400`}
`;

const ResponsiveButtonSecondary = styled(ButtonSecondary)`
  ${tw`text-base text-gray-300 w-fit-content font-medium my-2 bg-gray-500 px-5 py-2 rounded-lg hover:bg-dark-900 hover:text-yellow-400 hover:border-yellow-400`}
`;

const EmptyProposals = styled.div`
  border: 1px solid ${({ theme }) => theme.text4};
  padding: 16px 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Pool: FC<{
  onAddLiquidity: (currencyA?: string, currencyB?: string) => void;
  onCreateLiquidity: () => void;
  onPoolFinder: () => void;
  onRemoveLiquidity: (currencyA: string, currencyB: string) => void;
}> = ({
  onAddLiquidity,
  onCreateLiquidity,
  onPoolFinder,
  onRemoveLiquidity,
}) => {
  const { account } = useWeb3React();

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs();
  const tokenPairsWithLiquidityTokens = useMemo(
    () =>
      trackedTokenPairs.map((tokens) => ({
        liquidityToken: toV2LiquidityToken(tokens),
        tokens,
      })),
    [trackedTokenPairs]
  );
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens]
  );
  const [v2PairsBalances, fetchingV2PairBalances] =
    useTokenBalancesWithLoadingIndicator(account ?? undefined, liquidityTokens);

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  );

  const v2Pairs = usePairs(
    liquidityTokensWithBalances.map(({ tokens }) => tokens)
  );
  const v2IsLoading =
    fetchingV2PairBalances ||
    v2Pairs?.length < liquidityTokensWithBalances.length ||
    v2Pairs?.some((V2Pair) => !V2Pair);

  const allV2PairsWithLiquidity = v2Pairs
    .map(([, pair]) => pair)
    .filter((v2Pair): v2Pair is Pair => Boolean(v2Pair));

  return (
    <>
      <PageWrapper>
        <VoteCard>
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <span tw="text-yellow-400 text-xl">
                  LIQUIDITY PROVIDER REWARDS
                </span>
              </RowBetween>
              <div>
                <span tw="text-lg text-gray-200 leading-5">
                  Liquidity providers earn a 0.3% fee on all trades proportional
                  to their share of the pool.
                  <br /> Fees are added to the pool, accrue in real time and can
                  be claimed by withdrawing your liquidity. &nbsp;
                </span>
                <ExternalLink
                  href="https://pangolin.exchange/tutorials/manage-liquidity"
                  style={{ color: 'white', textDecoration: 'underline' }}
                  target="_blank"
                >
                  <span tw="text-lg text-gray-200 leading-5">
                    Read more about providing liquidity
                  </span>
                </ExternalLink>
              </div>
            </AutoColumn>
          </CardSection>
        </VoteCard>

        <AutoColumn gap="lg" justify="center">
          <AutoColumn gap="md" style={{ width: '100%' }}>
            <TitleRow padding={'0'} style={{ marginTop: '1rem' }}>
              <span tw="text-xl text-yellow-400 hidden sm:block">
                YOUR LIQUIDITY
              </span>
              <ButtonRow>
                <ResponsiveButtonSecondary onClick={onCreateLiquidity}>
                  CREATE A PAIR
                </ResponsiveButtonSecondary>
                <ResponsiveButtonPrimary
                  id="find-pool-button"
                  onClick={onPoolFinder}
                >
                  IMPORT POOL
                </ResponsiveButtonPrimary>
                <ResponsiveButtonPrimary
                  id="join-pool-button"
                  onClick={() => onAddLiquidity()}
                >
                  ADD LIQUIDITY
                </ResponsiveButtonPrimary>
              </ButtonRow>
            </TitleRow>

            {!account ? (
              <Card padding="40px">
                <span tw="text-gray-500 text-xl">
                  Connect to a wallet to view your liquidity.
                </span>
              </Card>
            ) : v2IsLoading ? (
              <EmptyProposals>
                <span tw="text-gray-500 text-xl">
                  <Dots>Loading</Dots>
                </span>
              </EmptyProposals>
            ) : allV2PairsWithLiquidity?.length > 0 ? (
              <>
                <ButtonSecondary>
                  <RowBetween>
                    <ExternalLink
                      href={
                        'https://info.pangolin.exchange/#/account/' + account
                      }
                    >
                      <span tw="text-xl">VIEW YOUR STAKED LIQUIDITY</span>
                    </ExternalLink>
                    <span> ↗ </span>
                  </RowBetween>
                </ButtonSecondary>
                {allV2PairsWithLiquidity.map((v2Pair) => (
                  <FullPositionCard
                    key={v2Pair.liquidityToken.address}
                    pair={v2Pair}
                    onAddLiquidity={onAddLiquidity}
                    onRemoveLiquidity={onRemoveLiquidity}
                  />
                ))}
              </>
            ) : (
              <EmptyProposals>
                <span tw="text-gray-500 text-xl">No Liquidity Found.</span>
              </EmptyProposals>
            )}
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
    </>
  );
};

export default Pool;
