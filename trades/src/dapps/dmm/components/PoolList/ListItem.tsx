import { Fraction, JSBI, Pair } from '@dynamic-amm/sdk';
import { useWeb3React } from '@romeblockchain/wallet';
import React, { useContext } from 'react';
import { MoreHorizontal } from 'react-feather';
import { useDispatch } from 'react-redux';
import { Flex } from 'rebass';
import styled from 'styled-components';
import tw from 'twin.macro';

import { DmmContext, DmmPage } from '../../../../widgets/Dmm/DmmContext';
import { AMP_HINT, MAX_ALLOW_APY } from '../../constants/index';
import { usePoolDetailModalToggle } from '../../state/application/hooks';
import { setSelectedPool } from '../../state/pools/actions';
import {
  SubgraphPoolData,
  UserLiquidityPosition,
} from '../../state/pools/hooks';
import { formattedNum, shortenAddress } from '../../utils';
import { currencyId } from '../../utils/currencyId';
import {
  checkIsFarmingPool,
  feeRangeCalc,
  getMyLiquidity,
  getTradingFeeAPR,
  priceRangeCalcByPair,
} from '../../utils/dmm';
import { unwrappedToken } from '../../utils/wrappedCurrency';
import { ButtonEmpty, ButtonPrimary } from '../Button';
import CopyHelper from '../Copy';
import AddCircle from '../Icons/AddCircle';
import DropIcon from '../Icons/DropIcon';
import MinusCircle from '../Icons/MinusCircle';
import WarningLeftIcon from '../Icons/WarningLeftIcon';
import InfoHelper from '../InfoHelper';
import Loader from '../Loader';
import { MouseoverTooltip } from '../Tooltip';

const TableRow = styled.div<{ fade?: boolean; oddRow?: boolean }>`
  display: grid;
  grid-gap: 1.5rem;
  grid-template-columns: 1.5fr 1fr 2fr 1.5fr repeat(3, 1fr) 1fr;
  grid-template-areas: 'pool ratio liq vol';
  padding: 15px 36px 13px 26px;
  font-size: 14px;
  align-items: flex-start;
  height: fit-content;
  position: relative;
  opacity: ${({ fade }) => (fade ? '0.6' : '1')};

  border: 1px solid transparent;

  &:hover {
    border: 1px solid #4a636f;
  }
`;

const StyledItemCard = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 4px;
  border-radius: 10px;
  margin-bottom: 0;
  padding: 8px 20px 24px 20px;

  font-size: 12px;
`;

const GridItem = styled.div<{ noBorder?: boolean }>`
  margin-top: 8px;
  margin-bottom: 8px;
  padding-bottom: 12px;
`;

const TradeButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  grid-column: 1 / span 3;
`;

const TradeButtonText = styled.span`
  font-size: 14px;
`;

const DataTitle = styled.div`
  ${tw`text-base font-medium items-center`}
  display: flex;

  &:hover {
    opacity: 0.6;
  }
  user-select: none;
  text-transform: uppercase;
  margin-bottom: 4px;
`;

const DataTextStyled = tw.div`flex flex-col text-base justify-center items-baseline h-full`;

const ButtonWrapper = styled(Flex)`
  justify-content: space-between;
`;

const StyledMoreHorizontal = styled(MoreHorizontal)``;

const PoolAddressContainer = styled(Flex)`
  ${tw`text-base flex items-center`}
`;

const APR = styled(DataTextStyled)``;

interface ListItemProps {
  pool: Pair;
  subgraphPoolData: SubgraphPoolData;
  myLiquidity?: UserLiquidityPosition;
  oddRow?: boolean;
}

export const ItemCard = ({
  myLiquidity,
  pool,
  subgraphPoolData,
}: ListItemProps) => {
  const { chainId } = useWeb3React();
  const amp = new Fraction(pool.amp).divide(JSBI.BigInt(10000));
  const { setCurrencyIdA, setCurrencyIdB, setPage, setPairAddress } =
    useContext(DmmContext);

  const realPercentToken0 = pool
    ? pool.reserve0
        .divide(pool.virtualReserve0)
        .multiply('100')
        .divide(
          pool.reserve0
            .divide(pool.virtualReserve0)
            .add(pool.reserve1.divide(pool.virtualReserve1))
        )
    : new Fraction(JSBI.BigInt(50));

  const realPercentToken1 = new Fraction(
    JSBI.BigInt(100),
    JSBI.BigInt(1)
  ).subtract(realPercentToken0 as Fraction);

  const percentToken0 = realPercentToken0.toSignificant(3);
  const percentToken1 = realPercentToken1.toSignificant(3);

  const isFarmingPool = checkIsFarmingPool(pool.address, chainId);
  const isWarning =
    realPercentToken0.lessThan(JSBI.BigInt(10)) ||
    realPercentToken1.lessThan(JSBI.BigInt(10));

  // Shorten address with 0x + 3 characters at start and end
  const shortenPoolAddress = shortenAddress(pool?.liquidityToken.address, 3);
  const currency0 = unwrappedToken(pool.token0);
  const currency1 = unwrappedToken(pool.token1);

  const volume = subgraphPoolData?.oneDayVolumeUSD
    ? subgraphPoolData?.oneDayVolumeUSD
    : subgraphPoolData?.oneDayVolumeUntracked;

  const fee = subgraphPoolData?.oneDayFeeUSD
    ? subgraphPoolData?.oneDayFeeUSD
    : subgraphPoolData?.oneDayFeeUntracked;

  const oneYearFL = getTradingFeeAPR(subgraphPoolData?.reserveUSD, fee).toFixed(
    2
  );

  const ampLiquidity = formattedNum(
    `${
      parseFloat(amp.toSignificant(5)) *
      parseFloat(subgraphPoolData?.reserveUSD)
    }`,
    true
  );

  const formatPriceMin = (price?: Fraction) => {
    return price?.toSignificant(6) ?? '0';
  };

  const formatPriceMax = (price?: Fraction) => {
    return !price || price.equalTo(new Fraction('-1'))
      ? '♾️'
      : price.toSignificant(6);
  };

  return (
    <div>
      {isFarmingPool && (
        <div style={{ position: 'absolute' }}>
          <MouseoverTooltip text="Available for yield farming">
            <DropIcon />
          </MouseoverTooltip>
        </div>
      )}

      {isWarning && (
        <div style={{ position: 'absolute' }}>
          <MouseoverTooltip text="One token is close to 0% in the pool ratio. Pool might go inactive.">
            <WarningLeftIcon />
          </MouseoverTooltip>
        </div>
      )}

      <StyledItemCard>
        <GridItem>
          <DataTitle>Pool</DataTitle>
          <DataTextStyled grid-area="pool">
            <PoolAddressContainer>
              {shortenPoolAddress}
              <CopyHelper toCopy={pool.address} />
            </PoolAddressContainer>
          </DataTextStyled>
        </GridItem>

        <GridItem>
          <DataTitle>My liquidity</DataTitle>
          <DataTextStyled>{getMyLiquidity(myLiquidity)}</DataTextStyled>
        </GridItem>

        <GridItem>
          <DataTextStyled style={{ alignItems: 'flex-end' }}>
            <PoolAddressContainer>
              {
                <ButtonEmpty
                  padding="0"
                  width="fit-content"
                  onClick={() => {
                    setPage(DmmPage.ADDLIQUIDITY);
                    setCurrencyIdA(currencyId(currency0, chainId));
                    setCurrencyIdB(currencyId(currency1, chainId));
                    setPairAddress(pool.address);
                  }}
                >
                  <AddCircle />
                </ButtonEmpty>
              }
              {getMyLiquidity(myLiquidity) !== '-' && (
                <ButtonEmpty
                  padding="0"
                  width="fit-content"
                  onClick={() => {
                    setPage(DmmPage.REMOVELIQUIDITY);
                    setCurrencyIdA(currencyId(currency0, chainId));
                    setCurrencyIdB(currencyId(currency1, chainId));
                    setPairAddress(pool.address);
                  }}
                >
                  <MinusCircle />
                </ButtonEmpty>
              )}
            </PoolAddressContainer>
          </DataTextStyled>
        </GridItem>

        <GridItem>
          <DataTitle>
            <span>AMP Liquidity</span>
            <InfoHelper
              size={12}
              text={
                'AMP factor x Liquidity in the pool. Amplified pools have higher capital efficiency and liquidity.'
              }
            />
          </DataTitle>
          <DataTextStyled grid-area="liq">
            <div>{!subgraphPoolData ? <Loader /> : ampLiquidity}</div>
          </DataTextStyled>
        </GridItem>
        <GridItem>
          <DataTitle>Volume (24h)</DataTitle>
          <DataTextStyled grid-area="vol">
            {!subgraphPoolData ? <Loader /> : formattedNum(volume, true)}
          </DataTextStyled>
        </GridItem>
        <GridItem>
          <DataTitle>
            <span>Ratio</span>
            <InfoHelper
              size={12}
              text={
                'Current token pair ratio of the pool. Ratio changes depending on pool trades. Add liquidity according to this ratio.'
              }
            />
          </DataTitle>
          <DataTextStyled grid-area="ratio" tw="w-20">
            <div>{`• ${percentToken0}% ${pool.token0.symbol}`}</div>
            <div>{`• ${percentToken1}% ${pool.token1.symbol}`}</div>
          </DataTextStyled>
        </GridItem>

        <GridItem>
          <DataTitle>Fee (24h)</DataTitle>
          <DataTextStyled>
            {!subgraphPoolData ? <Loader /> : formattedNum(fee, true)}
          </DataTextStyled>
        </GridItem>
        <GridItem>
          <DataTitle>
            <span>AMP</span>
            <InfoHelper size={12} text={AMP_HINT} />
          </DataTitle>
          <DataTextStyled>{formattedNum(amp.toSignificant(5))}</DataTextStyled>
        </GridItem>
        <GridItem>
          <DataTitle>
            APR
            <InfoHelper
              size={12}
              text={'Estimated return based on yearly fees of the pool'}
            />
          </DataTitle>

          <APR>
            {!subgraphPoolData ? (
              <Loader />
            ) : (
              `${Number(oneYearFL) > MAX_ALLOW_APY ? '--' : oneYearFL + '%'}`
            )}
          </APR>
        </GridItem>

        <GridItem noBorder style={{ gridColumn: '1 / span 2' }}>
          <DataTitle>Price Range</DataTitle>
          <div tw="flex flex-col items-baseline">
            <DataTextStyled tw="my-2">
              {pool.token0.symbol}/{pool.token1.symbol}:{' '}
              {formatPriceMin(priceRangeCalcByPair(pool)[0][0])} -{' '}
              {formatPriceMax(priceRangeCalcByPair(pool)[0][1])}
            </DataTextStyled>
            <DataTextStyled>
              {pool.token1.symbol}/{pool.token0.symbol}:{' '}
              {formatPriceMin(priceRangeCalcByPair(pool)[1][0])} -{' '}
              {formatPriceMax(priceRangeCalcByPair(pool)[1][1])}
            </DataTextStyled>
          </div>
        </GridItem>
        <GridItem noBorder>
          <DataTitle>Fee Range</DataTitle>
          <DataTextStyled>
            {feeRangeCalc(
              !!pool?.amp
                ? +new Fraction(pool.amp)
                    .divide(JSBI.BigInt(10000))
                    .toSignificant(5)
                : +amp
            )}
          </DataTextStyled>
        </GridItem>

        <TradeButtonWrapper>
          <ButtonPrimary
            padding="8px 48px"
            width="fit-content"
            onClick={() => setPage(DmmPage.SWAP)}
          >
            <TradeButtonText>Trade</TradeButtonText>
          </ButtonPrimary>
        </TradeButtonWrapper>
      </StyledItemCard>
    </div>
  );
};

const ListItem = ({
  myLiquidity,
  oddRow,
  pool,
  subgraphPoolData,
}: ListItemProps) => {
  const { chainId } = useWeb3React();
  const dispatch = useDispatch();
  const togglePoolDetailModal = usePoolDetailModalToggle();
  const { setCurrencyIdA, setCurrencyIdB, setPage, setPairAddress } =
    useContext(DmmContext);

  const amp = new Fraction(pool.amp).divide(JSBI.BigInt(10000));

  const realPercentToken0 = pool
    ? pool.reserve0
        .divide(pool.virtualReserve0)
        .multiply('100')
        .divide(
          pool.reserve0
            .divide(pool.virtualReserve0)
            .add(pool.reserve1.divide(pool.virtualReserve1))
        )
    : new Fraction(JSBI.BigInt(50));

  const realPercentToken1 = new Fraction(
    JSBI.BigInt(100),
    JSBI.BigInt(1)
  ).subtract(realPercentToken0 as Fraction);

  const percentToken0 = realPercentToken0.toSignificant(3);
  const percentToken1 = realPercentToken1.toSignificant(3);

  const isFarmingPool = checkIsFarmingPool(pool.address, chainId);
  const isWarning =
    realPercentToken0.lessThan(JSBI.BigInt(10)) ||
    realPercentToken1.lessThan(JSBI.BigInt(10));

  // Shorten address with 0x + 3 characters at start and end
  const shortenPoolAddress = shortenAddress(pool?.liquidityToken.address, 3);
  const currency0 = unwrappedToken(pool.token0);
  const currency1 = unwrappedToken(pool.token1);

  const volume = subgraphPoolData?.oneDayVolumeUSD
    ? subgraphPoolData?.oneDayVolumeUSD
    : subgraphPoolData?.oneDayVolumeUntracked;

  const fee = subgraphPoolData?.oneDayFeeUSD
    ? subgraphPoolData?.oneDayFeeUSD
    : subgraphPoolData?.oneDayFeeUntracked;

  const oneYearFL = getTradingFeeAPR(subgraphPoolData?.reserveUSD, fee).toFixed(
    2
  );

  const ampLiquidity = formattedNum(
    `${
      parseFloat(amp.toSignificant(5)) *
      parseFloat(subgraphPoolData?.reserveUSD)
    }`,
    true
  );

  const handleShowMore = () => {
    dispatch(
      setSelectedPool({
        myLiquidity,
        pool,
        subgraphPoolData,
      })
    );
    togglePoolDetailModal();
  };

  return (
    <TableRow oddRow={oddRow}>
      {isFarmingPool && (
        <div style={{ position: 'absolute' }}>
          <MouseoverTooltip text={'Available for yield farming'}>
            <DropIcon />
          </MouseoverTooltip>
        </div>
      )}

      {isWarning && (
        <div style={{ position: 'absolute' }}>
          <MouseoverTooltip
            text={
              'One token is close to 0% in the pool ratio. Pool might go inactive.'
            }
          >
            <WarningLeftIcon />
          </MouseoverTooltip>
        </div>
      )}
      <DataTextStyled grid-area="pool">
        <PoolAddressContainer>
          {shortenPoolAddress}
          <CopyHelper toCopy={pool.address} />
        </PoolAddressContainer>
      </DataTextStyled>
      <DataTextStyled>{formattedNum(amp.toSignificant(5))}</DataTextStyled>
      <DataTextStyled grid-area="amp-liq">
        {!subgraphPoolData ? <Loader /> : ampLiquidity}
      </DataTextStyled>
      <DataTextStyled grid-area="vol">
        {!subgraphPoolData ? <Loader /> : formattedNum(volume, true)}
      </DataTextStyled>
      <DataTextStyled>
        {!subgraphPoolData ? <Loader /> : formattedNum(fee, true)}
      </DataTextStyled>
      <APR>
        {!subgraphPoolData ? (
          <Loader />
        ) : (
          `${Number(oneYearFL) > MAX_ALLOW_APY ? '--' : oneYearFL + '%'}`
        )}
      </APR>
      <DataTextStyled grid-area="ratio" tw="w-20">
        <div>{`• ${percentToken0}% ${pool.token0.symbol}`}</div>
        <div>{`• ${percentToken1}% ${pool.token1.symbol}`}</div>
      </DataTextStyled>
      <DataTextStyled>{getMyLiquidity(myLiquidity)}</DataTextStyled>
      <ButtonWrapper>
        <ButtonEmpty
          padding="0"
          width="fit-content"
          onClick={() => {
            setPage(DmmPage.ADDLIQUIDITY);
            setCurrencyIdA(currencyId(currency0, chainId));
            setCurrencyIdB(currencyId(currency1, chainId));
            setPairAddress(pool.address);
          }}
        >
          <AddCircle height={15} width={15} />
        </ButtonEmpty>
        {getMyLiquidity(myLiquidity) !== '-' && (
          <ButtonEmpty
            padding="0"
            width="fit-content"
            onClick={() => {
              setPage(DmmPage.REMOVELIQUIDITY);
              setCurrencyIdA(currencyId(currency0, chainId));
              setCurrencyIdB(currencyId(currency1, chainId));
              setPairAddress(pool.address);
            }}
          >
            <MinusCircle height={15} width={15} />
          </ButtonEmpty>
        )}

        <ButtonEmpty padding="0" width="fit-content" onClick={handleShowMore}>
          <StyledMoreHorizontal tw="w-5" />
        </ButtonEmpty>
      </ButtonWrapper>
    </TableRow>
  );
};

export default ListItem;
