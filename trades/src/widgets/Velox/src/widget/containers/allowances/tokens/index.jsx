import { isWrappedNativeToken } from '@rbl/velox-common/multiChains';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { minAllowances } from '../../../../redux/derivedState';
import useTokenQuota from '../../../../redux/quotas/useTokenQuota';
import {
  getNativeToken,
  updateNativeToken,
} from '../../../../redux/wallet/walletSlice';
import { BorderedTable } from '../../../assets/styled';
import { withEnlargedProps } from '../../../WidgetSizeStateContext';
import useProvider from '../../ethereum/use-provider';
import QuotaWithWarning from './QuotaWithWarning';
import RowLayout, { TableHeaders } from './rowLayout';
import TokenSummary from './TokenSummary';
import Allowance from './TokenSummary/Allowance';

const NormalTokenTable = styled(BorderedTable)`
  width: 100%;
  thead tr {
    text-align: left;
  }

  td,
  th {
    font-size: 0.625rem;
    padding: 0.5rem 0;
  }

  th:last-child,
  td:last-child {
    text-align: right;
  }

  @media only screen and (max-width: 47.938rem) {
    /* Force table to not be like tables anymore */
    table,
    thead,
    tbody,
    th,
    td,
    tr {
      display: block;
    }
    tr {
      padding-bottom: 0.625rem;
      margin-top: 0.938rem;
    }

    ///* Hide table headers (but not display: none;, for accessibility) */
    thead tr {
      position: absolute;
      top: -624.938rem;
      left: -624.938rem;
    }

    td {
      /* Behave  like a "row" */
      position: relative;
      text-align: left;
      height: 2.5rem;
      font-size: 0.625rem;
    }
    //
    td:before {
      /* Now like a table header */
      text-align: left;
      position: absolute;
      top: 0.75rem;
      left: 0.375rem;
      width: 45%;
      padding-right: 0.625rem;
      white-space: nowrap;
    }

    td:nth-of-type(1) {
      padding-top: 0rem;
    }

    td:nth-of-type(1):before {
      content: 'TOKEN';
    }

    td:nth-of-type(2):before {
      content: 'BALANCE';
    }

    td:nth-of-type(3):before {
      content: 'ALLOWANCE';
    }
  }
`;

const EnlargedTokenTable = styled(NormalTokenTable)`
  th {
    font-size: 0.875rem;
  }

  td {
    padding: 1.875rem 0;
  }
`;

const TokenTable = withEnlargedProps(NormalTokenTable, EnlargedTokenTable);

export const Tokens = () => {
  const { token0, token1, volumeToken0, volumeToken1 } = useSelector(
    (state) => state?.velox?.tokenSearch.selectedPair
  );
  // const quotas = useSelector((state) => state?.velox?.quotas);
  const { selectedExchange } = useSelector((state) => state?.velox?.strategy);
  const token0Usd = useTokenQuota(token0.id, 'usd')?.value;
  const token1Usd = useTokenQuota(token1.id, 'usd')?.value;
  const { provider } = useProvider();
  const dispatch = useDispatch();
  const { token0MinAllowance, token1MinAllowance } = useSelector(minAllowances);
  const renderedTokens = [
    {
      minAllowance: token0MinAllowance,
      price: token0Usd,
      token: token0,
      volume: volumeToken0,
    },
    {
      minAllowance: token1MinAllowance,
      price: token1Usd,
      token: token1,
      volume: volumeToken1,
    },
  ];
  const hasNativeToken = renderedTokens.some((t) =>
    isWrappedNativeToken(
      selectedExchange.identifiers.blockchain,
      selectedExchange.identifiers.chainId,
      t.token.address
    )
  );
  const nativeToken = getNativeToken(selectedExchange);

  useEffect(() => {
    if (!hasNativeToken) {
      dispatch(updateNativeToken({ provider }));
    }
  }, [hasNativeToken, dispatch, provider]);

  if (!hasNativeToken) {
    renderedTokens.push({
      minAllowance: '1',
      price: undefined,
      token: nativeToken,
      volume: undefined, //1 will suffice since allowance is now nil or unlimited,
    });
  }

  return (
    <TokenTable>
      <TableHeaders />
      <tbody>
        {renderedTokens.map((rowData, index) => {
          const { price, token, volume } = rowData;
          return (
            <RowLayout
              key={index}
              col1={
                <TokenSummary price={price} token={token} volume={volume} />
              }
              col2={<QuotaWithWarning field={'balance'} token={token} />}
              col3={<Allowance field={'allowance'} token={token} />}
            />
          );
        })}
      </tbody>
    </TokenTable>
  );
};

export default Tokens;
