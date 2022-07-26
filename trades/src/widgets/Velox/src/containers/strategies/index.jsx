import uniqBy from 'lodash/uniqBy';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import IconRefresh from '../../assets/icons/icon-refresh.svg';
import { BorderedTable, MediumButton } from '../../assets/styled';
import { SmallSpinner } from '../../components/Icons';
import { DEFAULT_PAGE_SIZE } from '../../config';
import { filteredStrategies } from '../../redux/derivedState';
import {
  getUserStrategies,
  setStrategiesFilter,
} from '../../redux/strategy/strategySlice';
import {
  getWalletBalance,
  updateNativeToken,
} from '../../redux/wallet/walletSlice';
import useProvider from '../ethereum/use-provider';
import withCachedAuth from '../withCachedAuth';
import HeaderDropdown from './HeaderDropdown';
import StrategyPagination from './Pagination';
import StrategyRow from './StrategyRow';

const HideOnFullTable = styled.div`
  @media only screen and (min-width: 1101px) {
    display: none;
  }
`;

const StrategiesTable = styled(BorderedTable)`
  border-bottom: 1px solid #15b3b0;
  thead {
    border-bottom: 2px solid #15b3b0;
  }

  tr {
    border: none;
  }

  th,
  td {
    text-align: left;
  }

  th:nth-of-type(6),
  td:nth-of-type(6) {
    text-align: center;
  }

  td:nth-of-type(1) {
    width: 11%;
  }
  td:nth-of-type(2) {
    width: 11%;
  }
  td:nth-of-type(3) {
    width: 11%;
  }
  td:nth-of-type(4) {
    width: 15%;
  }
  td:nth-of-type(5) {
    width: 25%;
  }
  td:nth-of-type(6) {
    width: 9%;
  }
  td:nth-of-type(8) {
    width: 9%;
  }
  td:nth-of-type(9) {
    width: 9%;
  }
  @media only screen and (max-width: 1100px) {
    /* Force table to not be like tables anymore */
    table,
    thead,
    tbody,
    th,
    td,
    tr {
      display: block;
    }

    ///* Hide table headers (but not display: none;, for accessibility) */
    thead tr {
      position: absolute;
      top: -9999px;
      left: -9999px;
    }

    td {
      /* Behave  like a "row" */
      position: relative;
      padding-left: 50%;
    }
    //
    td:before {
      /* Now like a table header */
      text-align: left;
      position: absolute;
      top: 6px;
      left: 6px;
      width: 45%;
      padding-right: 10px;
      white-space: nowrap;
    }
    td:nth-of-type(1):before {
      content: 'EXCHANGE';
    }

    td:nth-of-type(2):before {
      content: 'BUY';
    }

    td:nth-of-type(3):before {
      content: 'SELL';
    }

    td:nth-of-type(4):before {
      content: 'AMOUNT';
    }
    td:nth-of-type(5):before {
      content: 'THRESHOLD';
    }
    td:nth-of-type(7):before {
      content: 'ATTEMPTS';
    }

    td:nth-of-type(8):before {
      content: 'STATUS';
    }

    td:nth-of-type(9):before {
      content: 'DELETE';
    }
  }
`;

const Strategies = () => {
  let {
    currentPage,
    getStrategiesError,
    initialStrategiesLoading,
    strategies,
  } = useSelector((state) => state?.velox?.strategy);
  const filterStrategies = useSelector(filteredStrategies);
  const [selectedExchange, setSelectedExchange] = useState(undefined);
  const connected = useSelector(
    (state) => state?.velox?.wallet.connection.connected
  );
  const visibleStrategies = filterStrategies
    .slice(DEFAULT_PAGE_SIZE * currentPage)
    .slice(0, DEFAULT_PAGE_SIZE);
  const dispatch = useDispatch();
  const { provider } = useProvider();
  const exchangeOptions = useMemo(
    () => uniqBy(strategies, 'exchange').map((s) => s.exchange),
    [strategies]
  );

  useEffect(() => {
    dispatch(setStrategiesFilter({ selectedExchange }));
  }, [strategies, selectedExchange, dispatch]);

  if (!connected) {
    return null;
  }
  if (getStrategiesError) {
    return (
      <div style={{ padding: '40px' }}>
        Something went wrong connecting to the Velox strategy engine.
        <br />
        <br />
        Please try again in a few minutes.
      </div>
    );
  }

  if (initialStrategiesLoading) {
    return (
      <div style={{ textAlign: 'center' }}>
        <SmallSpinner />
      </div>
    );
  }

  if (!strategies.length) {
    return (
      <div style={{ padding: '40px' }}>
        You don't have any active strategies on Velox.
        <br />
        <br /> Select a token pair and add allowances to make one!
      </div>
    );
  }

  const ExchangeDropdown = (
    <HeaderDropdown
      options={exchangeOptions}
      selectedOption={selectedExchange}
      title={'EXCHANGE'}
      onOptionSelect={(exchange) => {
        setSelectedExchange(exchange);
      }}
    />
  );

  const hasOldSignatureStrategy = strategies.some(
    (strategy) =>
      (strategy?.identifier?.length || 0) < 10 &&
      strategy?.strategyStatus !== 'SUCCESSFUL' &&
      strategy.numAttempts !== strategy.maxAttempts
  );

  return (
    <div style={{ textAlign: 'center' }}>
      {hasOldSignatureStrategy && (
        <span style={{ color: '#af98a4', fontSize: '18px' }}>
          You have have deprecated strategies that will no longer execute.
          Please delete and re-create all deprecated strategies as they will no
          longer execute under a new security upgrade.
        </span>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
        <HideOnFullTable>{ExchangeDropdown}</HideOnFullTable>

        <div style={{ marginLeft: 'auto', paddingBottom: '6px' }}>
          <span style={{ marginRight: '4px' }}>
            You must refresh to see new strategy status
          </span>
          <MediumButton
            onClick={() => {
              dispatch(getUserStrategies());
              dispatch(getWalletBalance({ provider }));
              dispatch(updateNativeToken({ provider }));
            }}
          >
            REFRESH
            <img alt="more than" src={IconRefresh} width="30px" />
          </MediumButton>
        </div>
      </div>
      <StrategiesTable>
        <thead>
          <tr>
            <th>{ExchangeDropdown}</th>
            <th>BUY</th>
            <th>SELL</th>
            <th>AMOUNT</th>
            <th>THRESHOLD</th>
            <th># OF RETRIES</th>
            <th>STATUS</th>
            <th>REMOVE</th>
          </tr>
        </thead>
        <tbody>
          {visibleStrategies?.map((strategy, index) => (
            <StrategyRow
              key={strategy.identifier}
              index={index}
              strategy={strategy}
            />
          ))}
        </tbody>
      </StrategiesTable>
      <StrategyPagination />
    </div>
  );
};
export default withCachedAuth(Strategies);
