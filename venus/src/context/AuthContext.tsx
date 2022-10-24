import React from 'react';
import noop from 'noop-ts';
import copyToClipboard from 'copy-to-clipboard';

import { Connector, useAuth } from 'clients/web3';
import toast from 'components/Basic/Toast';
import { AuthModal } from 'components/v2/AuthModal';

export interface IAccount {
  address: string;
  connector?: Connector;
}

export interface IAuthContextValue {
  logOut: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  account?: IAccount;
}

export const AuthContext = React.createContext<IAuthContextValue>({
  logOut: noop,
  openAuthModal: noop,
  closeAuthModal: noop,
});

export const AuthProvider: React.FC = ({ children }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);

  const { accountAddress, connectedWallet, logOut } = useAuth();

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const handleCopyAccountAddress = (accountAddressToCopy: string) => {
    copyToClipboard(accountAddressToCopy);

    toast.success({
      title: 'Wallet address copied to clipboard',
    });
  };

  const logoutAndCloseModal = () => {
    logOut();
    closeAuthModal();
  };

  const account = accountAddress
    ? {
        address: accountAddress,
      }
    : undefined;

  return (
    <AuthContext.Provider
      value={{
        account,
        logOut: logoutAndCloseModal,
        openAuthModal,
        closeAuthModal,
      }}
    >
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        account={account?.address}
        connectedWallet={connectedWallet}
        onLogOut={logoutAndCloseModal}
        onCopyAccountAddress={handleCopyAccountAddress}
      />
      {children}
    </AuthContext.Provider>
  );
};
