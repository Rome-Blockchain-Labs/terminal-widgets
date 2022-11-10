/** @jsxImportSource @emotion/react */
import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';

import { useIsMdDown } from 'hooks/responsive';
import { ReactComponent as LogoDesktop } from 'assets/img/v2/venusLogoWithText.svg';
import { ReactComponent as LogoMobile } from 'assets/img/v2/venusLogoMobile.svg';
import Logo from 'assets/img/v-logo.png';
import { Toolbar } from '../Toolbar';
import ClaimXvsRewardButton from '../ClaimXvsRewardButton';
import ConnectButton from '../ConnectButton';
import { useStyles } from './styles';
import BackButton from '../BackButton';

const Header = () => {
  const styles = useStyles();

  const isOnMobile = useIsMdDown();

  const marketDetailsMatch = useRouteMatch('/market/:vTokenId');

  return (
    <AppBar position="relative" css={styles.appBar}>
      <Toolbar css={styles.toolbar}>
        <Box display="flex" alignItems="center">
          {isOnMobile ? (
            <img src={Logo} width="50" height="50" alt="logo" />
          ) : (
            <LogoDesktop width="auto" height="auto" css={styles.logo} />
          )}
          {marketDetailsMatch && (
            <BackButton>
              BACK
            </BackButton>
          )}
        </Box>

        <div css={styles.ctaContainer}>
          <ConnectButton />
          <ClaimXvsRewardButton css={styles.claimXvsButton} />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
