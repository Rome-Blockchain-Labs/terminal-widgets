import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import {
  buildStepStatusMap,
  setCurrentStep,
} from '../../../redux/strategyConfig/strategyConfigSlice';
import { ArrowBack } from '../../components/common/icons';
import {
  StepPaginationButton,
  StepPaginationButtonProps,
} from '../../components/common/v2/StepPaginationButton';

const BackButton = styled(StepPaginationButton)`
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

function StepPaginationBackButton(props: any) {
  const strategyConfig = useSelector(
    (state: any) => state?.velox?.strategyConfig
  );

  const statusMap = buildStepStatusMap(strategyConfig);
  const currentStatus = statusMap[strategyConfig.currentStep];
  const prevStatus = statusMap[currentStatus.prevStep || ''];

  const buttonProps: StepPaginationButtonProps = {
    disabled: !prevStatus?.ready,
  };

  const dispatch = useDispatch();
  const onOpenedHandler = (name: any) => {
    dispatch(setCurrentStep(name));
  };

  const [hover, setHover] = useState(false);
  const onHover = useCallback(() => setHover(true), [setHover]);
  const unHover = useCallback(() => setHover(false), [setHover]);

  if (!prevStatus?.ready) return null;

  return (
    <FlatButton
      {...buttonProps}
      onClick={() => onOpenedHandler(currentStatus?.prevStep)}
    >
      <BackButton
        {...buttonProps}
        onMouseEnter={onHover}
        onMouseLeave={unHover}
      >
        <ArrowBack active={hover} {...buttonProps} />
        &nbsp; BACK
      </BackButton>
    </FlatButton>
  );
}

export default StepPaginationBackButton;
