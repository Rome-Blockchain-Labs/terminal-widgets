import React from 'react';
import { WalletProvider } from '@romeblockchain/wallet';
import Web3ReactManager from './Web3ReactManager';

const Web3Wrapper: React.FC = ({ children }) => (
  <WalletProvider>
    <Web3ReactManager>{children}</Web3ReactManager>
  </WalletProvider>
);

export default Web3Wrapper;
