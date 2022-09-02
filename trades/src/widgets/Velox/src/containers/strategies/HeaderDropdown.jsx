import React, { useState } from 'react';
import styled from 'styled-components';

import { Outline } from '../../assets/styled';

const BoldOnHover = styled.div`
  :hover {
    font-weight: bold;
  }
`;

const RelativeFixed = styled.div`
  cursor: pointer;
  position: relative;
  font-size: 14px;
  width: 160px;
  height: 35px;
  margin-bottom: 5px;
  * {
    transition: height 50ms;
  }
`;

export const HeaderDropdown = (props) => {
  const { onOptionSelect, options, selectedOption, title } = props;
  const [open, setOpen] = useState(false);

  if (open) {
    return (
      <RelativeFixed>
        <Outline
          style={{
            background: '#073842',
            height: `${options.length * 24 + 39}px`,
            left: 0,

            paddingLeft: '15px',

            paddingTop: '7px',

            position: 'absolute',
            // fontWeight:"10px",
            textAlign: 'left',
            top: 5,
            width: '120px',
            zIndex: 100,
          }}
          onMouseLeave={() => setOpen(false)}
        >
          <BoldOnHover
            style={{ marginBottom: '3px' }}
            onClick={() => {
              onOptionSelect(undefined);
              setOpen(false);
            }}
          >
            <div style={{ whiteSpace: 'nowrap' }}>{title}</div>
          </BoldOnHover>
          {options.map((option) => (
            <BoldOnHover
              key={option}
              style={{ marginBottom: '3px' }}
              onClick={() => {
                onOptionSelect(option);
                setOpen(false);
              }}
            >
              <div style={{ whiteSpace: 'nowrap' }}>{option} ▼</div>
            </BoldOnHover>
          ))}
        </Outline>
      </RelativeFixed>
    );
  }

  return (
    <RelativeFixed>
      <Outline
        style={{
          backgroundColor: '#05595a',
          fontWeight: 'bold',
          height: '30px',
          left: 0,
          paddingLeft: '15px',
          paddingTop: '4px',
          position: 'absolute',
          textAlign: 'left',
          top: 5,
          width: '120px',
        }}
        onClick={() => {
          setOpen(true);
        }}
      >
        <div style={{ whiteSpace: 'nowrap' }}>{selectedOption || title} ▼</div>
      </Outline>
    </RelativeFixed>
  );
};
export default HeaderDropdown;
