import React from 'react';
import { Wallet } from '@romeblockchain/wallet';

import { useTranslation } from 'translation';
import { Modal, IModalProps } from '../Modal';
import { AccountDetails, IAccountDetailsProps } from './AccountDetails';

export interface IAuthModalProps {
  isOpen: boolean;
  onClose: IModalProps['handleClose'];
  onLogOut: IAccountDetailsProps['onLogOut'];
  onCopyAccountAddress: IAccountDetailsProps['onCopyAccountAddress'];
  account?: IAccountDetailsProps['account'];
  connectedWallet?: IAccountDetailsProps['connectedWallet'];
}

export const AuthModal: React.FC<IAuthModalProps> = ({
  isOpen,
  onClose,
  onLogOut,
  onCopyAccountAddress,
  account = '',
  connectedWallet = Wallet.METAMASK,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      className="venus-modal"
      isOpened={isOpen}
      handleClose={onClose}
      noHorizontalPadding={!account}
      title={
        <h4>{t('authModal.title.yourWallet')}</h4>
      }
    >
      <AccountDetails
        account={account}
        connectedWallet={connectedWallet}
        onCopyAccountAddress={onCopyAccountAddress}
        onLogOut={onLogOut}
      />
    </Modal>
  );
};
