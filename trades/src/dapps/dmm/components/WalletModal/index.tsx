import 'twin.macro';

import { SUPPORTED_WALLETS, useWallets } from '@romeblockchain/wallet';
import { MetaMask } from '@web3-react/metamask';
import tw, { theme } from 'twin.macro';

import { CloseButton } from '../../../../components/buttons';
import MetamaskLogo from '../../../../components/icons/MetamaskLogo';
import WalletConnectLogo from '../../../../components/icons/WalletConnectLogo';
import { ModalWrapper } from '../../../../components/modals';
import { WalletBox } from '../../../../contexts/WalletsContext/WalletSelectionModal';
import { ApplicationModal } from '../../state/application/actions';
import {
  useModalOpen, useWalletModalToggle,
} from '../../state/application/hooks';

const HeaderRow = tw.div`flex justify-between items-center py-4 text-yellow-400 text-lg border-b-2 border-gray-400`;

export default function SettingsModal() {
  const open = useModalOpen(ApplicationModal.WALLET);
  const toggle = useWalletModalToggle();
  const { selectedWallet, setSelectedWallet } = useWallets();

  return (
    <ModalWrapper noPadding isOpen={open} onDismiss={toggle}>
      <div tw="w-full bg-green-700 px-4 rounded-lg">
        <div>
          <HeaderRow>
            <span tw="text-xl text-green-400">SELECT WALLET</span>
            <CloseButton
              color={theme`colors.green.400`}
              height={10}
              width={10}
              onClick={toggle}
            />
          </HeaderRow>
        </div>
          <div tw="top-0 w-full h-full z-30 flex justify-center">
              {Object.keys(SUPPORTED_WALLETS).map((key, index) => {
                const wallet = SUPPORTED_WALLETS[key];
                const isActive = selectedWallet === wallet.wallet;

                return (
                  <WalletBox
                    key={index}
                    connectHandler={async () => {
                      if (wallet.connector instanceof MetaMask) {
                        wallet.connector
                          .activate()
                          .then(() => {
                            setSelectedWallet(wallet.wallet)
                            toggle()
                          });
                      } else {
                        wallet.connector
                          .activate()
                          .then(() => {
                            setSelectedWallet(wallet.wallet)
                            toggle()
                          });
                      }
                    }}
                    isActive={isActive}
                    walletName={wallet.wallet}
                  >
                    {wallet.wallet === 'METAMASK' ? (
                      <MetamaskLogo size={30} />
                    ) : (
                      <WalletConnectLogo size={30} />
                    )}
                  </WalletBox>
                );
              })}
          </div>
      </div>
    </ModalWrapper>
  );
}
