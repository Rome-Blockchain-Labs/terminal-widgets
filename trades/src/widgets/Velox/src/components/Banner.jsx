import React, { useState } from 'react';
import styled from 'styled-components';

import IconCloseXYellow from '../assets/icons/icon-close-x.svg';
const Styled = styled.div`
  padding: 10px 25px;
  text-align: center;
  background: rgba(95, 47, 84, 0.6);
  border: 2px solid #ed127a;
  border-radius: 30px;
  color: white;
  font-size: 15px;
  margin: 10px;
`;

function Banner(props) {
  const [open, setOpen] = useState(true);

  return (
    <>
      {open && (
        <div style={{ position: 'relative' }}>
          <img
            alt={'close'}
            src={IconCloseXYellow}
            style={{
              cursor: 'pointer',
              position: 'absolute',
              right: '22px',
              top: '14px',
              width: '17px',
            }}
            onClick={() => setOpen(false)}
          />
          <Styled>
            This is a BETA release and should be used at your own risk!{' '}
          </Styled>
        </div>
      )}

      {props.children}
    </>
  );
}

export default Banner;
