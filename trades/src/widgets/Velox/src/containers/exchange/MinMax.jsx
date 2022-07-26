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
  width: 160px;
  height: 50px;
  * {
    transition: height 50ms;
  }
`;

const more = 'equal or more than';
const less = 'equal or less than';

export const MinMax = (props) => {
  const { isMax, toggleDir } = props;
  const [open, setOpen] = useState(false);

  if (open) {
    return (
      <RelativeFixed>
        <Outline
          style={{
            background: '#073842',
            height: '60px',
            left: 0,
            paddingTop: '7px',
            position: 'absolute',
            textAlign: 'center',
            top: 5,
            zIndex: 100,
          }}
          onMouseLeave={() => setOpen(false)}
        >
          <BoldOnHover
            style={{ marginBottom: '3px' }}
            onClick={() => {
              setOpen(false);
            }}
          >
            <div style={{ whiteSpace: 'nowrap' }}>{isMax ? less : more} ▼</div>
          </BoldOnHover>
          <BoldOnHover
            onClick={() => {
              toggleDir();
              setOpen(false);
            }}
          >
            {isMax ? more : less}
          </BoldOnHover>
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
          height: '45px',
          left: 0,
          paddingTop: '11px',
          position: 'absolute',
          textAlign: 'center',
          top: 5,
          width: '150px',
        }}
        onClick={() => {
          setOpen(true);
        }}
      >
        <div style={{ whiteSpace: 'nowrap' }}>{isMax ? less : more} ▼</div>
      </Outline>
    </RelativeFixed>
  );
};
export default MinMax;
