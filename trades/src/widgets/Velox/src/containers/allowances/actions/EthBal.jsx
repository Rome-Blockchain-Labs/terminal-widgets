import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { NumFont } from '../../../assets/styled';
import { SmallSpinner } from '../../../components/Icons';
import { trim } from '../../../utils/trimString';

const Wrapping = styled.div`
  text-align: right;

  @media (max-width: 991px) {
    b {
      display: block;
    }
  }
`;

const EthBal = () => {
  const { ethBalance, loadingBalance, loadingConversion } = useSelector(
    (state) => state?.velox?.wallet
  );
  const { selectedExchange } = useSelector((state) => state?.velox?.strategy);

  if (loadingConversion || loadingBalance) {
    return <SmallSpinner />;
  }

  return (
    <Wrapping>
      {' '}
      <b>
        MY {selectedExchange.identifiers.blockchain.toUpperCase()} BALANCE:
      </b>{' '}
      <NumFont>{trim(ethBalance)} </NumFont>{' '}
    </Wrapping>
  );
};

export default EthBal;
