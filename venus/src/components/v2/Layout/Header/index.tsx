/** @jsxImportSource @emotion/react */
import React from 'react';
import AppBar from '@mui/material/AppBar';

import { useIsMdDown } from 'hooks/responsive';
import { ReactComponent as LogoDesktop } from 'assets/img/v2/venusLogoWithText.svg';
import { ReactComponent as LogoMobile } from 'assets/img/v2/venusLogoMobile.svg';
import { Toolbar } from '../Toolbar';
import ClaimXvsRewardButton from '../ClaimXvsRewardButton';
import ConnectButton from '../ConnectButton';
import { useStyles } from './styles';

const Header = () => {
  const styles = useStyles();

  const isOnMobile = useIsMdDown();

  return (
    <AppBar position="relative" css={styles.appBar}>
      <Toolbar css={styles.toolbar}>
        {isOnMobile ? (
          <LogoMobile width="auto" height="auto" css={styles.logo} />
        ) : (
          <LogoDesktop width="auto" height="auto" css={styles.logo} />
        )}

        <div css={styles.ctaContainer}>
          <ConnectButton />
          <ClaimXvsRewardButton css={styles.claimXvsButton} />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
