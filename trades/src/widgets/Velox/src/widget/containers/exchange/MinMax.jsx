import React, { useState } from 'react';
import styled from 'styled-components';

import { DarkOutline, OutlineCaret } from '../../assets/styled';
import { withEnlargedProps } from '../../WidgetSizeStateContext';

const BoldOnHover = styled.div`
  :hover {
    font-weight: bold;
  }
`;

const NormalInlineBlock = styled.div`
  display: inline-block;
  position: relative;
  cursor: pointer;
  width: 6.875rem;
  height: 1.875rem;
`;

const EnlargedlInlineBlock = styled(NormalInlineBlock)`
  height: 3.75rem;
  border-radius: 3.75rem;
  width: 12.5rem;
`;

const InlineBlock = withEnlargedProps(NormalInlineBlock, EnlargedlInlineBlock);

const more = 'is equal or more';
const less = 'is equal or less';

const NormalDropDownOpenedOutline = styled(DarkOutline)`
  position: absolute;
  top: 0;
  height: ${(props) => (props.enlarged ? '6rem' : '3rem')};
`;
const EnlargedDropdownOpenedOutline = styled(NormalDropDownOpenedOutline)`
  text-align: center;
`;
const DropDownOpenedOutline = withEnlargedProps(
  NormalDropDownOpenedOutline,
  EnlargedDropdownOpenedOutline
);

const NormalDropDownOutline = styled(DarkOutline)`
  position: absolute;
  top: 0;
`;
const EnlargedDropDownOutline = styled(NormalDropDownOutline)`
  text-align: center;
`;
const DropDownOutline = withEnlargedProps(
  NormalDropDownOutline,
  EnlargedDropDownOutline
);

export const MinMax = (props) => {
  const { isMax, toggleDir } = props;
  const [open, setOpen] = useState(false);

  if (open) {
    return (
      <InlineBlock>
        <DropDownOpenedOutline
          onMouseLeave={() => {
            setOpen(false);
          }}
        >
          <BoldOnHover
            style={{ marginBottom: '.188rem' }}
            onClick={() => {
              setOpen(false);
            }}
          >
            <div>{isMax ? less : more}</div>
            <OutlineCaret>▼</OutlineCaret>
          </BoldOnHover>
          <BoldOnHover
            style={{ lineHeight: '0' }}
            onClick={() => {
              toggleDir();
              setOpen(false);
            }}
          >
            {isMax ? more : less}
          </BoldOnHover>
        </DropDownOpenedOutline>
      </InlineBlock>
    );
  }

  return (
    <InlineBlock>
      <DropDownOutline
        onClick={() => {
          setOpen(true);
        }}
      >
        <div>{isMax ? less : more}</div>
        <OutlineCaret>▼</OutlineCaret>
      </DropDownOutline>
    </InlineBlock>
  );
};
export default MinMax;
