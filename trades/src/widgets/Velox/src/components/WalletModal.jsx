import 'twin.macro';

import {
  getAddChainParameters,
  SUPPORTED_WALLETS,
  useWallets,
  Wallet,
} from '@romeblockchain/wallet';
import queryString from 'query-string';
import { useState } from 'react';
import { useEffect } from 'react';
import { AlertCircle, X } from 'react-feather';
import { useLocation } from 'react-router-dom';

import MetamaskLogo from '../../../../components/icons/MetamaskLogo';
import WalletConnectLogo from '../../../../components/icons/WalletConnectLogo';
import { getChainIdByNetworkName } from '../../../../constants/networkExchange';
import { WalletBox } from '../../../../contexts/WalletsContext/WalletSelectionModal';

const WalletModal = () => {
  const { handleConnect, selectedWallet } = useWallets();

  const { search } = useLocation();
  const widget = queryString.parse(search);
  const [error, setShowError] = useState(false);
  const [chainParams, setChainParams] = useState();

  useEffect(() => {
    if (widget.network) {
      const targetChain = getChainIdByNetworkName(widget.network);
      const targetChainParams = getAddChainParameters(targetChain);
      setChainParams(targetChainParams);
    }
  }, [widget.network]);
  return (
    <>
      <div tw="fixed top-0 z-20 w-full h-full bg-black bg-opacity-80" />
      <div tw="fixed top-0 w-full h-full z-30 flex justify-center items-center">
        <div tw="flex h-[110px] relative rounded-6">
          <div tw="bg-[#7A808A] flex items-center justify-center w-8 rounded-l-6">
            <span tw="-rotate-90 whitespace-nowrap text-[12px] text-[#00070E]">
              Change Wallet
            </span>
          </div>
          {error && (
            <div
              tw="fixed top-0 md:top-5 md:rounded-md bg-red-50 p-4 "
              onClick={() => setShowError(false)}
            >
              <X tw="h-5 w-5 text-gray-700 absolute right-4 top-2" />
              <div tw="flex">
                <div tw="flex-shrink-0">
                  <AlertCircle aria-hidden="true" tw="h-5 w-5 text-red-400" />
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

          <div tw="bg-[#232C38] flex items-center px-6 gap-x-12 rounded-r-6">
            {Object.keys(SUPPORTED_WALLETS)
              .filter((key) => key !== Wallet.COINBASE)
              .map((key, index) => {
                const wallet = SUPPORTED_WALLETS[key];
                const isActive = selectedWallet === wallet.wallet;

                return (
                  <WalletBox
                    key={index}
                    connectHandler={async () => {
                      try {
                        setShowError(false);
                        await handleConnect(wallet, chainParams);
                      } catch (error) {
                        setShowError(true);
                      }
                    }}
                    isActive={isActive}
                    walletName={wallet.wallet}
                  >
                    {wallet.wallet === 'METAMASK' ? (
                      <MetamaskLogo size={50} />
                    ) : (
                      <WalletConnectLogo size={50} />
                    )}
                  </WalletBox>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};

export default WalletModal;
