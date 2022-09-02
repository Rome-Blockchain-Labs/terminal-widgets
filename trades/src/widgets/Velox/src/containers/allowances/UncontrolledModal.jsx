import React, { useState } from 'react';
import { Modal } from 'reactstrap';
import styled from 'styled-components';

import IconCloseX from '../../assets/icons/icon-close-x.svg';
import { Button, ModalBlockHeader, OutlinedInput } from '../../assets/styled';

const StyledButton = styled(Button)`
  backface-visibility: hidden;
  cursor: pointer;
  background: linear-gradient(70deg, #15b3b0 0%, #ed127a 100%);
  border-radius: 100px;
  padding: 0; //13px 10px 10px 10px;
  color: #ffffff;
  font-weight: 600;
  font-size: 12px;
  width: 100px;
  text-align: center;
  display: inline;
  margin: 0;
`;

const StyledModal = styled(Modal)`
  > * {
    height: 180px;
    border-radius: 20px;
    border: 2px solid #067c82;
    background-color: #08333c;
    box-shadow: rgba(34, 178, 177, 0.5) 4px 0px 4px 0px,
      rgba(34, 178, 177, 0.5) 0px 4px 4px 0px;
  }
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
      <div onClick={toggleOpen}>{renderButton()}</div>
      <StyledModal centered={true} isOpen={isOpen} toggle={toggleOpen}>
        <ModalBlockHeader>{title}</ModalBlockHeader>
        <img
          alt={'close'}
          src={IconCloseX}
          style={{
            cursor: 'pointer',
            position: 'absolute',
            right: '15px',
            top: '12px',
            width: '17px',
          }}
          onClick={toggleOpen}
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
      </StyledModal>
    </div>
  );
};
export default UncontrolledModal;
