import React from 'react';
import styled from 'styled-components';

import connectButtonImg from '../assets/icons/icon-connect-wallet.svg';
import disconnectButtonImg from '../assets/icons/icon-disconnect-wallet.svg';
import { Button } from '../assets/styled';
import { firstAndLast } from '../utils/firstAndLast';
import { useWeb3Provider } from '../utils/web3';
const ConnectPlacement = styled.div`
  float: right;
  display: block;
`;
const StyledButton = styled(Button)`
  width: 210px;
`;
const AddressText = styled.div`
  margin: auto;
  font-size: 14px;
  padding: 7px;
  text-align: center;
  font-family: 'Fira Code', monospace;
  color: white;
`;

export const WalletConnector = () => {
  const { account, activate, active, deactivate } = useWeb3Provider();
  const miniAddress = firstAndLast(account);

  return (
    <ConnectPlacement>
      <StyledButton onClick={active ? deactivate : activate}>
        {active ? 'DISCONNECT WALLET' : 'CONNECT WALLET'}
        <img
          alt="Connect Wallet"
          id="veloxlogo"
          src={active ? disconnectButtonImg : connectButtonImg}
          width="40"
        />
      </StyledButton>
      <AddressText>{miniAddress}</AddressText>
    </ConnectPlacement>
  );
};
