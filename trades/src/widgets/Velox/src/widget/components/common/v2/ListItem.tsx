import styled from 'styled-components';

import { withEnlargedProps } from '../../../WidgetSizeStateContext';

const ListItemWapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const ListItemTextWrapper = styled.div`
  border-radius: 0.938rem 0 0 0.938rem;
  width: 1.875rem;
  align-self: stretch;
  position: relative;
  background: rgba(13, 109, 111, 0.8);
`;

const NormalListItemText = styled.div`
  text-align: center;
  font: normal normal bold 0.75rem Montserrat;
  letter-spacing: 0;
  color: #08333c;
  text-transform: uppercase;
  height: 1.875rem;
  margin-top: 0.188rem;
  margin-left: 0.938rem;

  -webkit-transform: rotate(-90deg);
  -moz-transform: rotate(-90deg);
  -o-transform: rotate(-90deg);
  -ms-transform: rotate(-90deg);
  transform: rotate(-90deg);
  direction: rtl;

  &.active {
    color: #00d3cf;
  }
`;

const EnlargedListItemText = styled.div`
  text-align: center;
  font: normal normal bold 1rem Montserrat;
  letter-spacing: 0;
  color: #08333c;
  text-transform: uppercase;
  height: 1.875rem;
  margin-top: 0.188rem;
  margin-left: 0.938rem;

  -webkit-transform: rotate(-90deg);
  -moz-transform: rotate(-90deg);
  -o-transform: rotate(-90deg);
  -ms-transform: rotate(-90deg);
  transform: rotate(-90deg);
  direction: rtl;

  &.active {
    color: #00d3cf;
  }
`;

const ListItemText = withEnlargedProps(
  NormalListItemText,
  EnlargedListItemText
);

const ListItemGutter = styled.div<{ isOpen: boolean }>`
  height: 100%;
  width: 0.188rem;
  background: none;

  ${({ isOpen }) =>
    isOpen &&
    `
    background: rgba(13, 109, 111, 0.8);
  `}
`;

function ListItem(props: any) {
  const { opened, ready } = props;
  const onOpenEventHandler = props.onOpen;

  const handleOnOpen = (opened: boolean) => {
    if (!props.ready) return;

    if (onOpenEventHandler) {
      onOpenEventHandler(props.name, opened);
    }
  };

  return (
    <>
      <ListItemWapper
        style={{ cursor: ready ? 'pointer' : 'auto' }}
        onClick={() => handleOnOpen(!opened)}
      >
        <ListItemTextWrapper>
          <ListItemText className={opened ? 'networkLogos' : ''}>
            {props.text}
          </ListItemText>
        </ListItemTextWrapper>
        <ListItemGutter isOpen={opened} />
      </ListItemWapper>
    </>
  );
}

export default ListItem;
