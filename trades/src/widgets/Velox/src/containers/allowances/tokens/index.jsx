import { isWrappedNativeToken } from '@rbl/velox-common/multiChains';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { BorderedTable } from '../../../assets/styled';
import { minAllowances } from '../../../redux/derivedState';
import {
  getNativeToken,
  updateNativeToken,
} from '../../../redux/wallet/walletSlice';
import useProvider from '../../ethereum/use-provider';
import QuotaWithWarning from './QuotaWithWarning';
import RowLayout, { TableHeaders } from './rowLayout';
import TokenSummary from './TokenSummary';
import Allowance from './TokenSummary/Allowance';

const TokenTable = styled(BorderedTable)`
  @media only screen and (max-width: 767px) {
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
      padding-bottom: 10px;
      margin-top: 15px;
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
      text-align: right;
      height: 40px;
    }
    //
    td:before {
      /* Now like a table header */
      text-align: left;
      position: absolute;
      top: 12px;
      left: 6px;
      width: 45%;
      padding-right: 10px;
      white-space: nowrap;
    }

    td:nth-of-type(1) {
      padding-top: 0px;
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

export const Tokens = () => {
  const {
    token0,
    token0Price,
    token1,
    token1Price,
    volumeToken0,
    volumeToken1,
  } = useSelector((state) => state?.velox?.tokenSearch.selectedPair);
  const { selectedExchange } = useSelector((state) => state?.velox?.strategy);
  const { provider } = useProvider();
  const dispatch = useDispatch();
  const { token0MinAllowance, token1MinAllowance } = useSelector(minAllowances);
  const renderedTokens = [
    {
      minAllowance: token0MinAllowance,
      price: token0Price,
      token: token0,
      volume: volumeToken0,
    },
    {
      minAllowance: token1MinAllowance,
      price: token1Price,
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
