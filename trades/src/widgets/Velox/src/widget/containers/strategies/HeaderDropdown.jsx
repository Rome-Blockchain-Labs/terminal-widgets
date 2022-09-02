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
  font-size: 0.625rem;
  height: 2.188rem;
  margin-bottom: 0.313rem;
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
            fontSize: '.625rem',
            height: `${options.length * 1.188 + 2}rem`,
            left: 0,
            paddingLeft: '.938rem',
            paddingTop: '.438rem',
            position: 'absolute',
            textAlign: 'left',
            top: 5,
            width: '7.5rem',
            zIndex: 100,
          }}
          onMouseLeave={() => setOpen(false)}
        >
          <BoldOnHover
            style={{ height: '1rem', marginBottom: '.188rem' }}
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
              style={{ height: '1rem', marginBottom: '.188rem' }}
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
          height: '1.875rem',
          left: 0,
          paddingLeft: '.938rem',
          paddingTop: '.25rem',
          position: 'absolute',
          textAlign: 'left',
          top: 5,
          width: '7.5rem',
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
