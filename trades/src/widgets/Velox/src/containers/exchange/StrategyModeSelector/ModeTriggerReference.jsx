import { useDispatch, useSelector } from 'react-redux';

import { Outline } from '../../../assets/styled';
import TokenImage from '../../../components/TokenImage';
import { setStrategyMode } from '../../../redux/strategy/strategySlice';
import { nativeToken, usd } from './allowableStrategyModes';

const ModeTriggerReference = (props) => {
  const { strategyMode } = useSelector((state) => state?.velox?.strategy);
  const dispatch = useDispatch();
  if (strategyMode === usd) {
    return (
      <Outline
        style={{
          backgroundColor: '#05595a',
          cursor: 'pointer',
          fontWeight: 'bold',
          height: '45px',
          padding: '11px',
          textAlign: 'center',
          width: '75px',
        }}
        onClick={() => dispatch(setStrategyMode(nativeToken))}
      >
        <div style={{ float: 'left' }}>USD</div>
        <div style={{ float: 'right' }}>▼</div>
      </Outline>
    );
  } else if (strategyMode === nativeToken) {
    return (
      <Outline
        style={{
          backgroundColor: '#05595a',
          cursor: 'pointer',
          fontWeight: 'bold',
          height: '45px',
          textAlign: 'center',
          width: '75px',
        }}
        onClick={() => dispatch(setStrategyMode(usd))}
      >
        <div style={{ float: 'left' }}>
          <TokenImage token={props.baseToken} />
        </div>
        <div style={{ float: 'right', padding: '7px' }}>▼</div>
      </Outline>
    );
  }
  throw new Error('Invalid strategy mode');
};

export default ModeTriggerReference;
