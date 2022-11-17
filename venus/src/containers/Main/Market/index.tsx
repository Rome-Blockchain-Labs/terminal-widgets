import React, { useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import BigNumber from 'bignumber.js';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { uid } from 'react-uid';

import { convertPercentageFromSmartContract, getToken } from 'utilities';
import {
  currencyFormatter,
  formatToReadablePercentage,
  formatCommaThousandsPeriodDecimal,
  format,
} from 'utilities/common';
import { Setting, TokenId } from 'types';
import { useMarkets } from 'hooks/useMarkets';
import { State } from 'core/modules/initialState';

const TableWrapper = styled.div`
  position: relative;
  width: 100%;
  border-radius: 8px;
  padding: 10px;
  margin: 0 auto;
  max-width: 1200px;

  @media (min-width: 510px) {
    padding: 20px;
  }

  .vai-apy {
    color: var(--color-green);
    font-size: 18px;
    margin-top: 20px;
    padding-bottom: 20px;
    font-weight: bold;
    border-bottom: 1px solid var(--color-bg-active);
  }

  .total-info {
    display: flex;
    flex-wrap: wrap;

    .total-item {
      background: var(--color-bg-primary);
      border-radius: 10px;
      padding: 5px 10px;
      width: 100%;

      margin-bottom: 10px;

      @media (min-width: 510px) {
        width: calc(50% - 5px);
        margin-right: 10px;

        &:last-child {
          margin-right: 0;
        }
      }

      .prop {
        font-weight: 600;
        color: var(--color-text-secondary);
      }

      .value {
        font-weight: 600;
        font-size: 20px;
        color: var(--color-white);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .table_content {
    .table_item {
      background: var(--color-bg-primary);
      padding: 8px 10px;
      margin-bottom: 10px;
      border-radius: 10px;
      border: 1px solid transparent;
      transition: border .2s ease-out;

      &:hover {
        background-color: var(--color-bg-active);
        border: 1px solid #3458C5;
      }
      div {
        color: var(--color-white);
        max-width: 100%;
      }

      .item-content {
        display: grid;
        gap: 10px;
        grid-template-columns: 1fr;

        @media (min-width: 400px) {
          grid-template-columns: 1fr auto;
        }

        @media (min-width: 510px) {
          gap: 15px;
          grid-template-columns: 1fr 1fr 1fr auto;
        }
      }

      .item-title {
        font-weight: 600;
        font-size: 16px;
        color: var(--color-white);

        &.green {
          color: #9dd562;
        }

        &.red {
          color: #f9053e;
        }
      }
      .item-value {
        font-weight: 600;
        font-size: 14px;
        color: var(--color-text-secondary);
      }
      .market {
        .highlight {
          word-break: break-all;
          white-space: break-spaces;
        }
        .asset-img {
          width: 30px;
          height: 30px;
          margin-right: 10px;
        }
        margin-bottom: 10px;

        @media (min-width: 510px) {
          margin-bottom: 15px;
        }
      }
    }
  }
`;

interface MarketProps extends RouteComponentProps {
  settings: Setting;
}

function Market({ history, settings }: MarketProps) {
  const [totalSupply, setTotalSupply] = useState('0');
  const [totalBorrow, setTotalBorrow] = useState('0');
  const [availableLiquidity, setAvailableLiquidity] = useState('0');
  const { markets, treasuryTotalUSDBalance } = useMarkets();

  const getTotalInfo = async () => {
    const tempTS = (markets || []).reduce(
      (accumulator, market) =>
        new BigNumber(accumulator).plus(new BigNumber(market.totalSupplyUsd)),
      new BigNumber(0),
    );
    const tempTB = (markets || []).reduce(
      (accumulator, market) =>
        new BigNumber(accumulator).plus(new BigNumber(market.totalBorrowsUsd)),
      new BigNumber(0),
    );
    const tempAL = (markets || []).reduce(
      (accumulator, market) => new BigNumber(accumulator).plus(new BigNumber(market.liquidity)),
      new BigNumber(0),
    );

    setTotalSupply(
      tempTS
        .plus(settings.vaultVaiStaked || new BigNumber(0))
        .dp(2, 1)
        .toString(10),
    );
    setTotalBorrow(tempTB.dp(2, 1).toString(10));
    setAvailableLiquidity(
      tempAL
        .plus(settings.vaultVaiStaked || new BigNumber(0))
        .dp(2, 1)
        .toString(10),
    );
  };

  useEffect(() => {
    if (markets) {
      getTotalInfo();
    }
  }, [markets]);

  return (
    <TableWrapper>
      <div className="total-info">
        <div className="total-item">
          <div className="prop">Total Supply</div>
          <div className="value" title={formatCommaThousandsPeriodDecimal(totalSupply)}>
            ${formatCommaThousandsPeriodDecimal(totalSupply)}
          </div>
        </div>
        <div className="total-item">
          <div className="prop">Available Liquidity</div>
          <div className="value" title={formatCommaThousandsPeriodDecimal(availableLiquidity)}>
            ${formatCommaThousandsPeriodDecimal(availableLiquidity)}
          </div>
        </div>
      </div>
      <div className="total-info">
        <div className="total-item">
          <div className="prop">Total Borrow</div>
          <div className="value" title={formatCommaThousandsPeriodDecimal(totalBorrow)}>
            ${formatCommaThousandsPeriodDecimal(totalBorrow)}
          </div>
        </div>
        <div className="total-item">
          <div className="prop">Total Treasury</div>
          <div
            className="value"
            title={formatCommaThousandsPeriodDecimal(treasuryTotalUSDBalance.dp(2).toString())}
          >
            ${formatCommaThousandsPeriodDecimal(treasuryTotalUSDBalance.dp(2).toString())}
          </div>
        </div>
      </div>
      {settings.vaiAPY && <div className="vai-apy">VAI Staking APY: {settings.vaiAPY}%</div>}
      <div className="table_content">
        {markets &&
          (markets || [])
            .map(market => ({
              ...market,
              totalSupplyApy: new BigNumber(market.supplyApy).plus(
                new BigNumber(market.supplyVenusApy),
              ),
              totalBorrowApy: new BigNumber(market.borrowVenusApy).plus(
                new BigNumber(market.borrowApy),
              ),
            }))
            .sort((a, b) => +new BigNumber(b.totalBorrowsUsd).minus(new BigNumber(a.totalBorrowsUsd)).toString(10))
            .map(item => (
              <div
                className="table_item pointer"
                key={uid(item)}
                onClick={() => history.push(`/market/${item.underlyingSymbol}`)}
              >
                <div className="flex align-center market">
                  <img
                    className="asset-img"
                    src={getToken(item.underlyingSymbol.toLowerCase() as TokenId)?.asset}
                    alt="asset"
                  />
                  <p className="item-title">{item.underlyingSymbol}</p>
                </div>
                <div className="item-content">
                  <div>
                    <p>Total Supply</p>
                    <p>
                      <span className="item-title">{currencyFormatter(item.totalSupplyUsd)} </span>
                      <span className="item-value">
                        (
                        {format(
                          new BigNumber(item.totalSupplyUsd).div(new BigNumber(item.tokenPrice)),
                          0,
                        )}{' '}
                        {item.underlyingSymbol}
                        )
                      </span>
                    </p>
                  </div>
                  <div>
                    <p>Supply APY</p>
                    <p>
                      <span className="item-title green">
                        {formatToReadablePercentage(item.totalSupplyApy)}
                      </span>
                      <span className="item-value"> ({formatToReadablePercentage(item.supplyVenusApy)})</span>
                    </p>
                  </div>
                  <div>
                    <p>Liquidity</p>
                    <p className="item-title">{currencyFormatter(item.liquidity)}</p>
                  </div>
                  <div>
                    <p>Total Borrow</p>
                    <p className="item-title">
                      {currencyFormatter(item.totalBorrowsUsd)}
                    </p>
                  </div>
                  <div>
                    <p>Borrow APY</p>
                    <p>
                      <span className={`item-title${item.totalBorrowApy.lt(0) ? ' red' : ' green'}`}>{formatToReadablePercentage(item.totalBorrowApy)} </span>
                      <span className="item-value">({formatToReadablePercentage(item.borrowVenusApy)})</span>
                    </p>
                  </div>
                  <div>
                    <p>Collateral Factor</p>
                    <p className="item-title">{formatToReadablePercentage(convertPercentageFromSmartContract(item.collateralFactor))}</p>
                  </div>
                  <div>
                    <p>Price</p>
                    <p className="item-title">{currencyFormatter(item.tokenPrice)}</p>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </TableWrapper>
  );
}

const mapStateToProps = ({ account }: State) => ({
  settings: account.setting,
});

export default connect(mapStateToProps)(withRouter(Market));
