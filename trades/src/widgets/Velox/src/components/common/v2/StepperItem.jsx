import styled from 'styled-components';

import IconArrowDown from '../../../assets/v2/arrow-down.svg';
import IconArrowUp from '../../../assets/v2/arrow-up.svg';
import IconCompleted from '../../../assets/v2/icon-check.svg';
import IconClose from '../../../assets/v2/icon-x.svg';
import { VerticalAlignCenter } from '../css';
import Card from './card';

const StepWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StepHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 20px;
  height: 80px;
`;

const StepBody = styled.div`
  flex: 1;
`;

const StepContent = styled.div`
  flex: 1;
  padding: 20px;
  min-height: 80px;
  min-width: 270px;
`;

const StepHeaderLabel = styled.div`
  height: 100%;
  text-align: left;
  flex: 1;
  font: normal normal bold 14px/18px Montserrat;
  letter-spacing: 0px;
  color: #00d3cf;
  text-transform: uppercase;
`;

const StepHeaderStatus = styled.div`
  width: 38px;
  height: 100%;
  text-align: center;
`;

const StepAction = styled.div`
  cursor: pointer;
  border-radius: 0 20px 20px 0;
  align-self: stretch;
  width: 46px;
  text-align: center;
  padding-top: 30px;
`;

function StepperItem(props) {
  const { opened } = props;
  const onOpenEventHandler = props.onOpen;

  const handleOnOpen = (opened) => {
    if (!props.ready) return;

    if (onOpenEventHandler) {
      onOpenEventHandler(props.name, opened);
    }
  };

  const cursor = props.ready ? 'pointer' : 'auto';

  return (
    <>
      <Card
        bodyStyle={{ backgroundColor: props.bodyBackgroundColor }}
        headerStyle={{ backgroundColor: props.indexBackgroundColor }}
        headerText={props.indexText}
      >
        <StepWrapper>
          <StepBody style={{ backgroundColor: props.bodyBackgroundColor }}>
            {!opened && (
              <StepHeader
                style={{ cursor }}
                onClick={() => handleOnOpen(!opened)}
              >
                <StepHeaderLabel>
                  <VerticalAlignCenter style={{ textAlign: 'left' }}>
                    {props.headerText}
                  </VerticalAlignCenter>
                </StepHeaderLabel>
                <StepHeaderStatus>
                  <VerticalAlignCenter style={{ textAlign: 'left' }}>
                    {props.completed ? (
                      <img alt={'complete'} src={IconCompleted} />
                    ) : (
                      <img alt={'close'} src={IconClose} />
                    )}
                  </VerticalAlignCenter>
                </StepHeaderStatus>
              </StepHeader>
            )}

            {opened && <StepContent>{props.children}</StepContent>}
          </StepBody>
          <StepAction
            style={{ backgroundColor: props.bodyBackgroundColor, cursor }}
            onClick={() => handleOnOpen(!opened)}
          >
            {opened ? (
              <img alt={'up'} src={IconArrowUp} />
            ) : (
              <img alt={'down'} src={IconArrowDown} />
            )}
          </StepAction>
        </StepWrapper>
      </Card>
    </>
  );
}

export default StepperItem;
