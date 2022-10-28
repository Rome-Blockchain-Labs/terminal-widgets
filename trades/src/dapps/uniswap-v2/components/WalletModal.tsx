import 'twin.macro';
import {
  SUPPORTED_WALLETS,
  useWallets,
  useWeb3React,
} from '@romeblockchain/wallet';
import { AddEthereumChainParameter } from '@web3-react/types';
import { useContext, useEffect, useState } from 'react';
import { PulseLoader } from 'react-spinners';

import MetamaskLogo from '../../../components/icons/MetamaskLogo';
import WalletConnectLogo from '../../../components/icons/WalletConnectLogo';
import { WalletBox } from '../../../contexts/WalletsContext/WalletSelectionModal';
import { PageContext } from '../PageContext';
import { useIFrameContext } from './IFrameProvider/index';
import { AlertCircle, X } from 'react-feather';

const WalletModal = ({
  chainParams,
}: {
  chainParams: number | AddEthereumChainParameter;
}) => {
  const { setWalletVisibility, walletVisibility } = useContext(PageContext);
  const { handleConnect, selectedWallet, setSelectedWallet } = useWallets();
  const { account, chainId } = useWeb3React();
  const { widgetBridge } = useIFrameContext();
  const [error, setShowError] = useState(false);

  const closeModal = () => {
    setWalletVisibility(false);
  };
  useEffect(() => {
    if (
      !account ||
      (typeof chainParams !== 'number' && chainId !== chainParams.chainId)
    ) {
      setWalletVisibility(true);
    }
  }, [account, setWalletVisibility, chainId, chainParams]);
  if (!walletVisibility) {
    return null;
  }

  return (
    <>
      <div tw="fixed top-0 z-20 w-full h-full bg-black bg-opacity-80" />
      <div tw="fixed top-0 w-full h-full z-30 flex justify-center items-center">
        <div tw="mx-3 p-6 w-full min-h-[215px] md:mx-0 md:w-1/2 bg-dark-500 flex flex-wrap justify-center items-center rounded-10 h-fit-content max-w-lg">
          {error && (
            <div
              onClick={() => setShowError(false)}
              tw="fixed top-0 md:top-5 md:rounded-md bg-red-50 p-4 "
            >
              <X tw="h-5 w-5 text-gray-700 absolute right-4 top-2" />
              <div tw="flex">
                <div tw="flex-shrink-0">
                  <AlertCircle tw="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div tw="ml-3">
                  <h3 tw=" font-medium text-red-800 text-[16px]">
                    Wallet connection error
                  </h3>
                  <div tw="mt-2 text-[14px] text-red-700">
                    Unable to connect to the selected wallet. Please login to
                    your wallet and try again.
                  </div>
                </div>
              </div>
            </div>
          )}
          <div tw="w-full text-yellow-400 flex">
            <span> CONNECT / SWITCH TO A WALLET</span>
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
                    setShowError(false);
                    await handleConnect(
                      wallet.connector,
                      wallet.wallet,
                      chainParams,
                      widgetBridge
                    );
                    closeModal();
                  } catch (error) {
                    setShowError(true);
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
    </>
  );
};

export default WalletModal;
