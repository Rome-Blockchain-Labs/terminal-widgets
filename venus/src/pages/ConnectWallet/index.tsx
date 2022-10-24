/** @jsxImportSource @emotion/react */
import React from 'react';
import { Typography } from '@mui/material';
import {
  getAddChainParameters,
  SUPPORTED_WALLETS,
  useWallets,
} from '@romeblockchain/wallet';
import { useTranslation } from 'translation';

import { ReactComponent as LogoDesktop } from 'assets/img/v2/venusLogoWithText.svg';
import { WALLET_LOGO_MAP } from 'components/v2/AuthModal/constants';
import { CHAIN_ID } from 'config';

import { useStyles } from './styles';

function ConnectWallet() {
  const styles = useStyles();
  const { t } = useTranslation();

  const { handleConnect, setSelectedWallet } = useWallets();

  function getOptions() {
    return Object.keys(SUPPORTED_WALLETS).map((key) => {
      const wallet = SUPPORTED_WALLETS[key];
      const WalletLogo = WALLET_LOGO_MAP[wallet.wallet];

      return (
        <button
          key={key}
          type="button"
          onClick={async () => {
            const chainParams = getAddChainParameters(CHAIN_ID);
            await handleConnect(
              wallet.connector,
              setSelectedWallet,
              wallet.wallet,
              null,
              chainParams,
            );
          }}
          css={styles.connectButton}
        >
          <WalletLogo css={styles.walletLogo} />
          <Typography css={styles.walletName} component="span">
            {wallet.name}
          </Typography>
        </button>
      );
    });
  }

  return (
    <main css={styles.root}>
      <LogoDesktop width="auto" height="auto" css={styles.logo} />
      <div css={styles.divider} />
      <Typography css={styles.title} variant="h4">{t('connectWallet.title')}</Typography>
      <div css={styles.optionsGrid}>
        {getOptions()}
      </div>
    </main>
  );
}

export default ConnectWallet;
