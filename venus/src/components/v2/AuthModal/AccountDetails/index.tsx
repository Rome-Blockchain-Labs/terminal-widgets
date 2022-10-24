/** @jsxImportSource @emotion/react */
import React from 'react';
import Typography from '@mui/material/Typography';
import { Wallet } from '@romeblockchain/wallet';

import { useTranslation } from 'translation';
import { truncateAddress } from 'utilities/truncateAddress';
import { BscLink } from '../../BscLink';
import { Icon } from '../../Icon';
import { SecondaryButton } from '../../Button';
import { WALLET_LOGO_MAP } from '../constants';
import { useStyles } from './styles';

export interface IAccountDetailsProps {
  onLogOut: () => void;
  onCopyAccountAddress: (accountAddress: string) => void;
  account: string;
  connectedWallet: Wallet;
}

export const AccountDetails: React.FC<IAccountDetailsProps> = ({
  onLogOut,
  onCopyAccountAddress,
  account,
  connectedWallet,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const truncatedAccountAddress = truncateAddress(account);

  const WalletLogo = WALLET_LOGO_MAP[connectedWallet];

  return (
    <div css={styles.container}>
      <div css={styles.infoContainer}>
        {WalletLogo && <WalletLogo css={styles.walletLogo} />}

        <div css={styles.infoRightColumn}>
          <Typography component="span" css={styles.walletName}>
            {String(connectedWallet).toLowerCase()}
          </Typography>

          <div css={styles.accountAddressContainer}>
            <Typography component="span" css={styles.accountAddress}>
              {account}
            </Typography>

            {/* Only displayed on mobile */}
            <Typography component="span" css={styles.accountAddressMobile}>
              {truncatedAccountAddress}
            </Typography>

            <button
              onClick={() => onCopyAccountAddress(account)}
              type="button"
              css={styles.copyButton}
            >
              <Icon name="copy" css={styles.copyButtonIcon} />
            </button>
          </div>
        </div>
      </div>

      <BscLink css={styles.bscScanLinkContainer} hash={account} />

      <SecondaryButton onClick={onLogOut} fullWidth>
        {t('authModal.accountDetails.logOutButtonLabel')}
      </SecondaryButton>
    </div>
  );
};
