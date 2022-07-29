import React, { useState } from 'react';
import styled from 'styled-components';

import IconCloseX from '../../assets/icons/icon-close-x.svg';
import { Button, OutlinedInput } from '../../assets/styled';

const StyledButton = styled(Button)`
  backface-visibility: hidden;
  cursor: pointer;
  background: linear-gradient(70deg, #15b3b0 0%, #ed127a 100%);
  border-radius: 6.25rem;
  padding: 0; //.813rem .625rem .625rem .625rem;
  color: #ffffff;
  font-weight: 600;
  font-size: 0.75rem;
  width: 6.25rem;
  text-align: center;
  display: inline;
  margin: 0;
`;

const StyledModal = styled.div`
  display: none;

  ${({ isOpen }) =>
    isOpen &&
    `
    display: block!important;
  `}
`;

const ModalContent = styled.div`
  position: relative;
`;

const UncontrolledModal = (props) => {
  const { buttonDisabled, buttonLabel, onButtonPush, renderButton, title } =
    props;
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('0');
  const toggleOpen = () => setIsOpen((b) => !b);

  const onValueToConvertChanged = (e) => {
    const valStr = e.target.value;
    if (parseFloat(valStr) >= 0 || valStr === '' || valStr === '.') {
      setAmount(valStr);
    }
  };

  return (
    <div>
      {!isOpen && <div onClick={toggleOpen}>{renderButton()}</div>}
      <StyledModal isOpen={isOpen}>
        <ModalContent>
          <div>{title}</div>
          <img
            alt={'close'}
            src={IconCloseX}
            style={{
              cursor: 'pointer',
              position: 'absolute',
              right: '.938rem',
              top: '.75rem',
              width: '1.063rem',
            }}
            onClick={() => setIsOpen(false)}
          />
          <div style={{ display: 'flex', margin: 'auto' }}>
            <OutlinedInput
              charLength={amount?.length}
              min="0"
              step="any"
              style={{ margin: 0 }}
              type="tel"
              value={amount}
              onChange={onValueToConvertChanged}
            />
            <StyledButton
              color="primary"
              disabled={buttonDisabled}
              onClick={() => {
                onButtonPush(amount);
                setIsOpen(false);
              }}
            >
              {buttonLabel}
            </StyledButton>
          </div>
        </ModalContent>
      </StyledModal>
    </div>
  );
};
export default UncontrolledModal;
