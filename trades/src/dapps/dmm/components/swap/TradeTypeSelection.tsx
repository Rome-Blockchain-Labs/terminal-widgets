import React from 'react';
import { Text } from 'rebass/styled-components';

import { useSwapActionHandlers, useSwapState } from '../../state/swap/hooks';
import { GasStation, MoneyFill } from '../Icons';
import { ButtonReturnType, GroupButtonReturnTypes } from './styleds';

export default function TradeTypeSelection() {
  const { saveGas } = useSwapState();
  const { onChooseToSaveGas } = useSwapActionHandlers();
  return (
    <GroupButtonReturnTypes>
      <ButtonReturnType
        active={!saveGas}
        role="button"
        onClick={() => onChooseToSaveGas(false)}
      >
        <MoneyFill />
        <Text marginLeft="4px">Max Return</Text>
      </ButtonReturnType>
      <ButtonReturnType
        active={saveGas}
        role="button"
        onClick={() => onChooseToSaveGas(true)}
      >
        <GasStation />
        <Text marginLeft="4px">Lowest Gas</Text>
      </ButtonReturnType>
    </GroupButtonReturnTypes>
  );
}
