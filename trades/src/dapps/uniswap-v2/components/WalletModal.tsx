import 'twin.macro';

import { SUPPORTED_WALLETS, useWallets } from '@romeblockchain/wallet';
import { AddEthereumChainParameter } from '@web3-react/types';
import { useContext, useState } from 'react';
import { PulseLoader } from 'react-spinners';
import Loader from 'react-spinners/CircleLoader';

import { CloseIcon } from '../../../components/icons';
import MetamaskLogo from '../../../components/icons/MetamaskLogo';
import WalletConnectLogo from '../../../components/icons/WalletConnectLogo';
import {
  handleConnect,
  WalletBox,
} from '../../../contexts/WalletsContext/WalletSelectionModal';
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
  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    setWalletVisibility(false);
  };
  if (!walletVisibility) {
    return null;
  }
  if (loading) {
    return (
      <>
        <div tw="fixed top-0 z-20 w-full h-full bg-black bg-opacity-80" />
        <div tw="fixed top-0 w-full h-full z-30 flex justify-center items-center">
          <PulseLoader color="#FFCC00" />
        </div>
      </>
    );
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
                  setLoading(true);
                  await handleConnect(
                    wallet.connector,
                    setSelectedWallet,
                    wallet.wallet,
                    widgetBridge,
                    chainParams
                  );
                  setLoading(false);
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
