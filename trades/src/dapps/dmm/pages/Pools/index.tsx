import 'twin.macro';

import { Currency } from '@dynamic-amm/sdk';
import { FC, useCallback, useContext, useMemo, useState } from 'react';

import { WidgetLoader } from '../../../../components/loaders';
import { useWallets } from '../../../../contexts/WalletsContext/WalletContext';
import { useWindowDimensions } from '../../../../hooks';
import { DmmContext, DmmPage } from '../../../../widgets/Dmm/DmmContext';
import { ButtonPrimary } from '../../components/Button';
import Loader from '../../components/Loader';
import Panel from '../../components/Panel';
import PoolList from '../../components/PoolList';
import PoolsCurrencyInputPanel from '../../components/PoolsCurrencyInputPanel';
import { SwitchLocaleLink } from '../../components/SwitchLocaleLink';
import { useCurrency } from '../../hooks/Tokens';
import { useGlobalData } from '../../state/about/hooks';
import { useETHPrice } from '../../state/application/hooks';
import { Field } from '../../state/pair/actions';
import { useDerivedPairInfo } from '../../state/pair/hooks';
import {
  useBulkPoolData,
  useResetPools,
  useUserLiquidityPositions,
} from '../../state/pools/hooks';
import { currencyId } from '../../utils/currencyId';
import { formatBigLiquidity } from '../../utils/formatBalance';
import {
  AddLiquidityInstructionContainer,
  AddLiquidityInstructionText,
  AddLiquidityTitle,
  CurrencyWrapper,
  GlobalDataContainer,
  GlobalDataItem,
  GlobalDataItemTitle,
  GlobalDataItemValue,
  PageWrapper,
  SearchWrapper,
  SelectPairInstructionWrapper,
  ToolbarWrapper,
} from './styleds';

const Pools: FC = () => {
  const { account, chainId } = useWallets();
  const [searchValue] = useState('');

  const { currencyIdA, currencyIdB, setCurrencyIdA, setCurrencyIdB, setPage } =
    useContext(DmmContext);

  const width = useWindowDimensions()?.width || 0;

  const above768 = width > 768;

  const currencyA = useCurrency(currencyIdA);
  const currencyB = useCurrency(currencyIdB);
  const { currencies, pairs } = useDerivedPairInfo(
    currencyA ?? undefined,
    currencyB ?? undefined
  );

  const ethPrice = useETHPrice();

  const handleCurrencyASelect = useCallback(
    (currencyA: Currency) => {
      const newCurrencyIdA = currencyId(currencyA, chainId);
      setCurrencyIdA(newCurrencyIdA);
    },
    [chainId, setCurrencyIdA]
  );
  const handleCurrencyBSelect = useCallback(
    (currencyB: Currency) => {
      const newCurrencyIdB = currencyId(currencyB, chainId);
      setCurrencyIdB(newCurrencyIdB);
    },
    [chainId, setCurrencyIdB]
  );

  const poolsList = useMemo(
    () =>
      pairs
        .map(([_, pair]) => pair)
        .filter((pair) => pair !== null)
        .filter((pair) => {
          if (searchValue) {
            return pair?.address
              .toLowerCase()
              .includes(searchValue.toLowerCase());
          }

          return true;
        }),
    [pairs, searchValue]
  );

  // format as array of addresses
  const formattedPools = useMemo(
    () => poolsList.map((pool) => pool?.address.toLowerCase()),
    [poolsList]
  );

  useResetPools(currencyA ?? undefined, currencyB ?? undefined);

  // get data for every pool in list
  const { data: poolsData, loading: loadingPoolsData } = useBulkPoolData(
    formattedPools,
    ethPrice.currentPrice
  );

  // const { loading: loadingUserLiquidityPositions, data: userLiquidityPositions } = useUserLiquidityPositions(account)
  const temp = useUserLiquidityPositions(account);
  const loadingUserLiquidityPositions = !account ? false : temp.loading;
  const userLiquidityPositions = !account
    ? { liquidityPositions: [] }
    : temp.data;

  const data = useGlobalData();

  const globalData = data && data.dmmFactories[0];
  const aggregatorData = data?.aggregatorData;

  // const { data: farms, loading: loadingPoolFarm } = useFarmsData();

  // const popularPairs: PopularPair[] = POPULAR_PAIRS[chainId as ChainId];

  // const uniquePairs: { [key: string]: boolean } = {};

  return (
    <>
      <PageWrapper>
        <div tw="bg-green-700 p-4 rounded-xl">
          <GlobalDataContainer isMobile={!above768}>
            <GlobalDataItem>
              <GlobalDataItemTitle>Total Trading Volume:</GlobalDataItemTitle>
              <GlobalDataItemValue>
                {aggregatorData?.totalVolume ? (
                  formatBigLiquidity(aggregatorData.totalVolume, 2, true)
                ) : (
                  <Loader />
                )}
              </GlobalDataItemValue>
            </GlobalDataItem>
            <GlobalDataItem>
              <GlobalDataItemTitle>Total Value Locked:</GlobalDataItemTitle>
              <GlobalDataItemValue>
                {globalData ? (
                  formatBigLiquidity(globalData.totalLiquidityUSD, 2, true)
                ) : (
                  <Loader />
                )}
              </GlobalDataItemValue>
            </GlobalDataItem>
            <GlobalDataItem>
              <GlobalDataItemTitle>Total AMP Liquidity:</GlobalDataItemTitle>
              <GlobalDataItemValue>
                {globalData ? (
                  formatBigLiquidity(
                    globalData.totalAmplifiedLiquidityUSD,
                    2,
                    true
                  )
                ) : (
                  <Loader />
                )}
              </GlobalDataItemValue>
            </GlobalDataItem>
          </GlobalDataContainer>

          <AddLiquidityInstructionContainer>
            <AddLiquidityTitle>ADD LIQUIDITY:</AddLiquidityTitle>
            <AddLiquidityInstructionText>
              Receive liquidity pool tokens representing your position and earn
              fees proportional to your pool share. Fees are automatically
              claimed when you withdraw your liquidity.
            </AddLiquidityInstructionText>
          </AddLiquidityInstructionContainer>

          {above768 ? (
            <>
              <div tw="mb-4 text-green-400 text-xl font-bold">SELECT PAIR</div>
              <ToolbarWrapper>
                <CurrencyWrapper>
                  <PoolsCurrencyInputPanel
                    currency={currencies[Field.CURRENCY_A]}
                    id="input-tokena"
                    otherCurrency={currencies[Field.CURRENCY_B]}
                    showCommonBases={true}
                    onCurrencySelect={handleCurrencyASelect}
                  />
                  <span style={{ margin: '0 8px' }}>/</span>
                  <PoolsCurrencyInputPanel
                    currency={currencies[Field.CURRENCY_B]}
                    id="input-tokenb"
                    otherCurrency={currencies[Field.CURRENCY_A]}
                    showCommonBases={true}
                    onCurrencySelect={handleCurrencyBSelect}
                  />

                  {currencies[Field.CURRENCY_A] &&
                    currencies[Field.CURRENCY_B] && (
                      <ButtonPrimary
                        padding="8px 28px"
                        style={{ borderRadius: '4px', marginLeft: '1rem' }}
                        width="fit-content"
                        onClick={() => setPage(DmmPage.SWAP)}
                      >
                        <span>Trade</span>
                      </ButtonPrimary>
                    )}
                </CurrencyWrapper>

                <SearchWrapper>
                  {/* <Search
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                  /> */}
                  <ButtonPrimary
                    padding="10px 12px"
                    style={{
                      borderRadius: '4px',
                      float: 'right',
                    }}
                    width="max-content"
                    onClick={() => setPage(DmmPage.CREATEPOOL)}
                  >
                    + Create New Pool
                  </ButtonPrimary>
                </SearchWrapper>
              </ToolbarWrapper>
            </>
          ) : (
            <>
              <ToolbarWrapper>
                Select Pair
                <SearchWrapper>
                  <ButtonPrimary
                    padding="10px 12px"
                    style={{
                      borderRadius: '4px',
                      float: 'right',
                      fontSize: '14px',
                    }}
                    onClick={() => setPage(DmmPage.CREATEPOOL)}
                  >
                    + Create New Pool
                  </ButtonPrimary>
                </SearchWrapper>
              </ToolbarWrapper>
              <CurrencyWrapper>
                <PoolsCurrencyInputPanel
                  currency={currencies[Field.CURRENCY_A]}
                  id="input-tokena"
                  otherCurrency={currencies[Field.CURRENCY_B]}
                  onCurrencySelect={handleCurrencyASelect}
                />
                <span style={{ margin: '0 8px' }}>/</span>
                <PoolsCurrencyInputPanel
                  currency={currencies[Field.CURRENCY_B]}
                  id="input-tokenb"
                  otherCurrency={currencies[Field.CURRENCY_A]}
                  onCurrencySelect={handleCurrencyBSelect}
                />
              </CurrencyWrapper>
            </>
          )}
          <div tw="my-2"></div>
          <Panel>
            {loadingUserLiquidityPositions || loadingPoolsData ? (
              <div tw="w-full flex items-center justify-center">
                <WidgetLoader />
              </div>
            ) : poolsList.length > 0 ? (
              <PoolList
                maxItems={2}
                poolsList={poolsList}
                subgraphPoolsData={poolsData}
                userLiquidityPositions={
                  userLiquidityPositions?.liquidityPositions
                }
              />
            ) : (
              <SelectPairInstructionWrapper>
                <div style={{ marginBottom: '1rem' }}>
                  There are no pools for this token pair.
                </div>
                <div>
                  Create a new pool or select another pair of tokens to view the
                  available pools.
                </div>
              </SelectPairInstructionWrapper>
            )}
          </Panel>

          {/* <Flex alignItems="center" marginTop="1rem">
            {(loadingPoolFarm ||
              (!loadingPoolFarm &&
                (!!Object.values(farms).flat().length ||
                  !!popularPairs.length))) && <span>Popular Pairs</span>}
            &nbsp;
            {loadingPoolFarm && <Loader />}
          </Flex>
          <Flex alignItems="center" flexWrap="wrap" justifyContent="flexStart">
            {popularPairs.map((pair, index) => (
              <PoolFarm key={index} farm={pair} />
            ))}

            {Object.values(farms)
              .flat()
              .filter((farm) => {
                if (
                  uniquePairs[`${farm.token0?.symbol}-${farm.token1?.symbol}`]
                )
                  return false;
                uniquePairs[`${farm.token0?.symbol}-${farm.token1?.symbol}`] =
                  true;
                return true;
              })
              .map((farm, index) => (
                <PoolFarm key={index} farm={farm} />
              ))}
          </Flex> */}
        </div>
      </PageWrapper>
      <SwitchLocaleLink />
    </>
  );
};

export default Pools;
