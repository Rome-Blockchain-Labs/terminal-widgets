/** @jsxImportSource @emotion/react */
import React, { useContext, useState } from 'react';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'translation';

import { AuthContext } from 'context/AuthContext';
import { useGetXvsReward, useClaimXvsReward } from 'clients/api';
import { Icon } from '../../Icon';
import { SecondaryButton, IButtonProps } from '../../Button';
import ClaimRewardsModal from './ClaimRewardsModal';
import { useStyles } from './styles';

const XVS_SYMBOL = 'xvs';

export const TEST_ID = 'claim-xvs-reward-button';

export interface IClaimXvsRewardButton extends Omit<IButtonProps, 'onClick'> {
  onClaim: () => Promise<string>;
  amountWei?: BigNumber;
}

export const ClaimXvsRewardButtonUi: React.FC<IClaimXvsRewardButton> = ({
  amountWei,
  onClaim,
  ...otherProps
}) => {
  const { t, Trans } = useTranslation();
  const styles = useStyles();

  const [isClaimRewardModalOpen, setIsClaimRewardModalOpen] = useState(false);

  if (!amountWei || amountWei.isEqualTo(0)) {
    return null;
  }

  const closeClaimRewardModal = () => {
    setIsClaimRewardModalOpen(false);
  };

  const handleClick = async () => {
    setIsClaimRewardModalOpen(true);
  };

  return (
    <>
      <SecondaryButton
        data-testid={TEST_ID}
        css={styles.button}
        onClick={handleClick}
        {...otherProps}
      >
        <Trans
          i18nKey="claimXvsRewardButton.title"
          components={{
            Icon: <Icon css={styles.icon} name={XVS_SYMBOL} />,
          }}
        />
      </SecondaryButton>

      <ClaimRewardsModal
        isOpened={isClaimRewardModalOpen}
        onClose={closeClaimRewardModal}
      />
    </>
  );
};

export const ClaimXvsRewardButton: React.FC<IButtonProps> = props => {
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
    <ClaimXvsRewardButtonUi
      amountWei={xvsRewardWei}
      loading={isClaimXvsRewardLoading}
      onClaim={handleClaim}
      {...props}
    />
  );
};

export default ClaimXvsRewardButton;
