/** @jsxImportSource @emotion/react */
import React from 'react';
import Box from '@mui/material/Box';

import { useTranslation } from 'translation';
import { AuthContext } from 'context/AuthContext';
import { truncateAddress } from 'utilities/truncateAddress';
import { SecondaryButton, IButtonProps } from '../../Button';
import { Icon } from '../../Icon';
import { useStyles } from './styles';

export interface IConnectButton extends IButtonProps {
  accountAddress?: string;
}

export const ConnectButtonUi: React.FC<IConnectButton> = ({ accountAddress, ...otherProps }) => {
  const { t } = useTranslation();
  const styles = useStyles();

  return (
    <SecondaryButton {...otherProps} css={styles.button}>
      <Box display="flex" justifyContent="center" alignItems="center" flexWrap="wrap">
        <Icon css={styles.icon} name="wallet" />
        {!accountAddress ? t('connectButton.title') : truncateAddress(accountAddress)}
      </Box>
    </SecondaryButton>
  );
};

export const ConnectButton: React.FC<IButtonProps> = props => {
  const { account, openAuthModal } = React.useContext(AuthContext);
  return (
    <ConnectButtonUi
      accountAddress={account?.address}
      onClick={openAuthModal}
      variant={account ? 'secondary' : 'primary'}
      {...props}
    />
  );
};

export default ConnectButton;
