import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import {
  buildStepStatusMap,
  setCurrentStep,
} from '../../../redux/strategyConfig/strategyConfigSlice';
import { ArrowNext } from '../../components/common/icons';
import {
  StepPaginationButton,
  StepPaginationButtonProps,
} from '../../components/common/v2/StepPaginationButton';

const NextButton = styled(StepPaginationButton)`
  width: 6.625rem;
  svg {
    margin-top: -3px;
    display: inline-block;
  }
`;

const FlatButton = styled.button`
  background: none;
  outline: none !important;
  box-shadow: none;
  padding: 0.25rem;
`;

function StepPaginationNextButton(props: any) {
  const strategyConfig = useSelector(
    (state: any) => state?.velox?.strategyConfig
  );

  const statusMap = buildStepStatusMap(strategyConfig);
  const currentStatus = statusMap[strategyConfig.currentStep];
  const nextStatus = statusMap[currentStatus.nextStep || ''];

  const buttonProps: StepPaginationButtonProps = {
    disabled: !nextStatus?.ready,
  };

  const dispatch = useDispatch();
  const onOpenedHandler = (name: any) => {
    dispatch(setCurrentStep(name));
  };

  const [hover, setHover] = useState(false);
  const onHover = useCallback(() => setHover(true), [setHover]);
  const unHover = useCallback(() => setHover(false), [setHover]);

  if (!nextStatus?.ready) return null;

  return (
    <FlatButton
      {...buttonProps}
      onClick={() => onOpenedHandler(currentStatus.nextStep)}
    >
      <NextButton
        {...buttonProps}
        {...buttonProps}
        onMouseEnter={onHover}
        onMouseLeave={unHover}
      >
        NEXT&nbsp;&nbsp;
        <ArrowNext active={hover} {...buttonProps} />
      </NextButton>
    </FlatButton>
  );
}

export default StepPaginationNextButton;
