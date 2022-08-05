import 'twin.macro';

import { RomeEventType } from '@romeblockchain/bridge';
import { SUPPORTED_WALLETS, useWallets } from '@romeblockchain/wallet';
import { MetaMask } from '@web3-react/metamask';
import { AddEthereumChainParameter } from '@web3-react/types';
import { useContext } from 'react';

import { CloseIcon } from '../../../components/icons';
import MetamaskLogo from '../../../components/icons/MetamaskLogo';
import WalletConnectLogo from '../../../components/icons/WalletConnectLogo';
import { EventGroups } from '../../../contexts/GtagContext';
import { WalletBox } from '../../../contexts/WalletsContext/WalletSelectionModal';
import { PageContext } from '../PageContext';
import { useIFrameContext } from './IFrameProvider/index';

const WalletModal = ({
  chainParams,
}: {
  chainParams: number | AddEthereumChainParameter;
}) => {
  const { setWalletVisibility, walletVisibility } = useContext(PageContext);
  const { selectedWallet, setSelectedWallet } = useWallets();
  const { widgetBridge } = useIFrameContext();

  const closeModal = () => {
    setWalletVisibility(false);
  };
  if (!walletVisibility) {
    return null;
  }
  return (
    <>
      <div tw="fixed top-0 z-20 w-full h-full bg-black bg-opacity-80" />
      <div tw="fixed top-0 w-full h-full z-30 flex justify-center items-center">
        <div tw="mx-3 p-6 w-full h-1/2 min-h-[215px] md:mx-0 md:w-1/2 bg-dark-500 flex flex-wrap justify-center items-center rounded-10 h-fit-content max-w-lg">
          <div tw="w-full text-yellow-400 flex">
            <span>CONNECT / SWITCH TO A WALLET</span>
            <button tw="ml-auto mr-3 " onClick={closeModal}>
              <CloseIcon color="#C1FF00" height={17} width={17} />
            </button>
          </div>
          <hr tw="w-full bg-gray-50 mt-2" />
          {Object.keys(SUPPORTED_WALLETS).map((key, index) => {
            const wallet = SUPPORTED_WALLETS[key];
            const isActive = selectedWallet === wallet.wallet;

            return (
              <WalletBox
                key={index}
                connectHandler={async () => {
                  try {
                    if (wallet.connector instanceof MetaMask) {
                      wallet.connector
                        .activate(chainParams)
                        .then(() => setSelectedWallet(wallet.wallet));
                    } else {
                      if (typeof chainParams === 'number') {
                        wallet.connector
                          .activate(chainParams)
                          .then(() => setSelectedWallet(wallet.wallet));
                      } else {
                        wallet.connector
                          .activate(chainParams.chainId)
                          .then(() => setSelectedWallet(wallet.wallet));
                      }
                    }
                    widgetBridge?.emit(
                      RomeEventType.WIDGET_GOOGLE_ANALYTICS_EVENT,
                      {
                        event: `${wallet.wallet.replace(
                          ' ',
                          '_'
                        )}_Successful_Connection`,
                        eventGroup: EventGroups.WalletConnection,
                      }
                    );
                  } catch (error) {}

                  closeModal();
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
    </>
  );
};

export default WalletModal;
