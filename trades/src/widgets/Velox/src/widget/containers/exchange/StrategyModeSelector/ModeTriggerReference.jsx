import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { setStrategyMode } from '../../../../redux/strategy/strategySlice';
import { DarkOutline, OutlineCaret } from '../../../assets/styled';
import { withEnlargedProps } from '../../../WidgetSizeStateContext';
import { nativeToken, usd } from './allowableStrategyModes';

const NormalStrategyOutline = styled(DarkOutline)`
  text-align: left;
  position: relative;
  width: 4rem;
`;

const EnlargedStrategyOutline = styled(NormalStrategyOutline)`
  text-align: center;
  width: 7rem;
`;

const StrategyOutline = withEnlargedProps(
  NormalStrategyOutline,
  EnlargedStrategyOutline
);

const ModeTriggerReference = (props) => {
  const { strategyMode } = useSelector((state) => state?.velox?.strategy);
  const dispatch = useDispatch();

  if (strategyMode === usd) {
    return (
      <StrategyOutline
        style={{
          cursor: 'pointer',
        }}
        onClick={() => dispatch(setStrategyMode(nativeToken))}
      >
        <div>USD</div>
        <OutlineCaret>▼</OutlineCaret>
      </StrategyOutline>
    );
  } else if (strategyMode === nativeToken) {
    return (
      <StrategyOutline
        style={{
          cursor: 'pointer',
        }}
        onClick={() => dispatch(setStrategyMode(usd))}
      >
        <div>{props.baseToken.symbol}</div>
        <OutlineCaret>▼</OutlineCaret>
      </StrategyOutline>
    );
  }
  throw new Error('Invalid strategy mode');
};

export default ModeTriggerReference;
