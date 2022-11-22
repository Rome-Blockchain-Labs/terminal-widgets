/** @jsxImportSource @emotion/react */
import React, { useContext } from 'react';
import BigNumber from 'bignumber.js';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'translation';

import {
  useGetXvsReward,
  useClaimXvsReward,
} from 'clients/api';
import { TOKENS } from 'constants/tokens';
import { AuthContext } from 'context/AuthContext';
import toast from 'components/Basic/Toast';
import { IModalProps, Modal } from 'components/v2/Modal';
import { Icon } from 'components/v2/Icon';
import { SecondaryButton } from 'components/v2/Button';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString';
import { Token, TokenId } from 'types';
import { useStyles } from './styles';

export interface IClaimRewardsUiProps {
  amountWei?: BigNumber;
  isClaimLoading?: boolean;
  className?: string;
  isOpened: IModalProps['isOpened'];
  onClose: IModalProps['handleClose'];
  handleConfirm?: () => Promise<string>;
}

const XVS_SYMBOL = 'xvs';

/**
 * The fade effect on this component results in that it is still rendered after the asset has been set to undefined
 * when closing the modal.
 */
export const ClaimRewardsUi: React.FC<IClaimRewardsUiProps> = ({
  amountWei,
  isOpened,
  isClaimLoading,
  onClose,
  handleConfirm,
}) => {
  const styles = useStyles();

  const { t, Trans } = useTranslation();

  const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

  const readableAmount = useConvertWeiToReadableTokenString({
    valueWei: amountWei!,
    token: TOKENS.xvs as Token,
    minimizeDecimals: true,
  });

  const handleClick = async () => {
    if (!handleConfirm) return;

    try {
      const transactionHash = await handleConfirm();

      // Display successful transaction modal
      openSuccessfulTransactionModal({
        title: t('claimXvsRewardButton.successfulTransactionModal.title'),
        message: t('claimXvsRewardButton.successfulTransactionModal.message'),
        amount: {
          valueWei: amountWei!,
          tokenId: 'xvs' as TokenId,
        },
        transactionHash,
      });
    } catch (error) {
      toast.error({
        title: (error as Error).message,
      });
    } finally {
      onClose();
    }
  };

  return (
    <Modal
      title={
        <Typography variant="h4" css={styles.modalTitle}>
          <Trans
            i18nKey="claimXvsRewardModal.title"
            components={{
              Icon: <Icon css={styles.icon} name={XVS_SYMBOL} />,
            }}
          />
        </Typography>
      }
      isOpened={isOpened}
      handleClose={onClose}
    >
      <Box display="flex" flexDirection="column" flexGrow="1">
        <Box paddingY={8} paddingX={4} flexGrow="1" display="flex" justifyContent="center" alignItems="center">
          <Typography variant="body1" css={styles.modalBody}>
            {t('claimXvsRewardModal.body', { amount: readableAmount })}
          </Typography>
        </Box>
        <SecondaryButton
          onClick={handleClick}
          fullWidth
          loading={isClaimLoading}
        >
          {t('claimXvsRewardModal.submitButton')}
        </SecondaryButton>
      </Box>
    </Modal>
  );
};

const ClaimRewardsModal: React.FC<IClaimRewardsUiProps> = props => {
  const { account } = useContext(AuthContext);
  const { data: xvsRewardWei } = useGetXvsReward(account?.address);
  const { t } = useTranslation();

  const { mutateAsync: claimXvsReward, isLoading: isClaimXvsRewardLoading } = useClaimXvsReward();

  const handleClaim = async () => {
    if (!account?.address) {
      throw new Error(t('errors.walletNotConnected'));
    }

    const res = await claimXvsReward({
      fromAccountAddress: account.address,
    });

    return res.transactionHash;
  };

  return (
    <ClaimRewardsUi
      {...props}
      amountWei={xvsRewardWei}
      isClaimLoading={isClaimXvsRewardLoading}
      handleConfirm={handleClaim}
    />
  );
};

export default ClaimRewardsModal;
