import { multiChains } from '@rbl/velox-common';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { OutlinedDarkInput } from '../../assets/styled';
import { gasGweiToMinWeth } from '../../config';
import { INVALID, validateStrategy } from '../../redux/derivedState';
import { updateGwei } from '../../redux/strategy/strategySlice';
import { trim } from '../../utils/trimString';
import { getWrappedNativeTokenSymbol } from '../../utils/web3';
const { NETWORKS } = multiChains;

const DivFlex = styled.div`
  display: flex;
`;

const roundUpTo2Decimals = (num) => (num + 0.004999).toFixed(2);

const MaxGas = ({ fixedGasPrice }) => {
  const dispatch = useDispatch();
  const invalidReasons = useSelector(validateStrategy);
  const { gwei, selectedExchange } = useSelector(
    (state) => state?.velox?.strategy
  );
  const { connection } = useSelector((state) => state?.velox?.wallet);
  const { connected } = connection;

  useEffect(() => {
    if (fixedGasPrice) {
      dispatch(updateGwei(fixedGasPrice));
    } else {
      if (
        selectedExchange?.key?.toLowerCase() ===
        NETWORKS.BSC.MAINNET.PANCAKESWAP.NAME.toLowerCase()
      ) {
        dispatch(updateGwei(5));
      }
    }
  }, [selectedExchange, dispatch, fixedGasPrice]);
  if (!connected) {
    return null;
  }

  return (
    <DivFlex style={{ justifyContent: 'space-between' }}>
      <DivFlex style={{ alignItems: 'center' }}>
        <OutlinedDarkInput
          disabled={fixedGasPrice}
          id={'max-gas-field'}
          invalid={invalidReasons.includes(INVALID.STEP1_GAS)}
          value={trim(gwei)}
          onChange={(e) => dispatch(updateGwei(e.target.value))}
        />
        <div>
          <span
            style={{
              fontSize: '1rem',
              paddingLeft: '10px',
              textAlign: 'center',
            }}
          >
            {connection?.chainHex === '0xa86a' ? 'nAVAX (GWEI)' : 'GWEI'}
          </span>
        </div>
      </DivFlex>
      <div style={{ width: '50%' }}>
        {
          <>
            <b>Maximum of {roundUpTo2Decimals(gasGweiToMinWeth * gwei)}</b>{' '}
            {getWrappedNativeTokenSymbol()} is required at the time this
            strategy executes.
          </>
        }
      </div>
    </DivFlex>
  );
};

export default MaxGas;
