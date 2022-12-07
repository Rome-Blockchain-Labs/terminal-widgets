/** @jsxImportSource @emotion/react */
import React, { useEffect } from 'react';
import Box from '@mui/material/Box';

import { useWeb3React } from '@romeblockchain/wallet';
import { widgetBridge, RomeEventType } from '@romeblockchain/bridge';
import Header from './Header';
import { PageContainer } from './PageContainer';
import { useStyles } from './styles';

export interface ILayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<ILayoutProps> = ({ children }) => {
  const styles = useStyles();
  const { connector } = useWeb3React();

  useEffect(() => {
    const disconnectFromWallet = () => {
      if (connector.deactivate) {
        connector.deactivate();
      } else {
        connector.resetState();
      }
    };
    widgetBridge.subscribe(RomeEventType.WIDGET_WALLET_DISCONNECT_EVENT, () => {
      disconnectFromWallet();
    });
  }, [connector]);

  return (
    <div css={styles.layout}>
      <Box display="flex" flexDirection="column" flex="1" alignItems="center">
        <Header />
        <PageContainer>{children}</PageContainer>
      </Box>
    </div>
  );
};
