import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { trim } from '../../../../utils/trimString';
import { NumFont } from '../../../assets/styled';
import { SmallSpinner } from '../../../components/Icons';
import { withEnlargedProps } from '../../../WidgetSizeStateContext';

const NormalWrapping = styled.div`
  text-align: right;
  font-size: ${(props) => (props.enlarged ? '.875rem' : '.625rem')};
  @media (max-width: 480px) {
    b {
      display: block;
    }
  }
`;

const Wrapping = withEnlargedProps(NormalWrapping);

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
      <b>
        &nbsp;MY {selectedExchange.identifiers.blockchain.toUpperCase()}{' '}
        BALANCE:&nbsp;&nbsp;
      </b>
      <NumFont>{trim(ethBalance)} </NumFont>{' '}
    </Wrapping>
  );
};

export default EthBal;
