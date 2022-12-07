import 'twin.macro';

import {
  getAddChainParameters,
  SUPPORTED_WALLETS,
  useWallets,
  useWeb3React,
  Wallet,
} from '@romeblockchain/wallet';
import { Network } from '@web3-react/network';
import { AddEthereumChainParameter } from '@web3-react/types';
import queryString from 'query-string';
import { useContext, useEffect, useState } from 'react';
import { AlertCircle, X } from 'react-feather';
import { useLocation } from 'react-router-dom';

import { CoinbaseIcon } from '../../../components/icons/Coinbase';
import MetamaskLogo from '../../../components/icons/MetamaskLogo';
import WalletConnectLogo from '../../../components/icons/WalletConnectLogo';
import { getChainIdByNetworkName } from '../../../constants/networkExchange';
import { WalletBox } from '../../../contexts/WalletsContext/WalletSelectionModal';
import { PageContext } from '../PageContext';

const WalletModal = ({
  chainParams,
}: {
  chainParams: number | AddEthereumChainParameter;
}) => {
  const { setWalletVisibility, walletVisibility } = useContext(PageContext);
  const { handleConnect, selectedWallet } = useWallets();
  const { account, chainId, connector, isActivating } = useWeb3React();
  const [error, setShowError] = useState(false);

  const { search } = useLocation();
  useEffect(() => {
    const widget = queryString.parse(search) as any;
    const targetChain = getChainIdByNetworkName(widget.network);
    if (chainId && chainId !== targetChain && selectedWallet) {
      window.location.reload();
    }
  }, [account, chainId, connector, isActivating, search, selectedWallet]);

  useEffect(() => {
    if (connector instanceof Network) {
      setWalletVisibility(true);
    }
  }, [connector, setWalletVisibility]);

  if (!walletVisibility) {
    return null;
  }
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

                const chainParams = getAddChainParameters(43114);
                return (
                  <WalletBox
                    key={index}
                    connectHandler={async () => {
                      try {
                        setShowError(false);
                        await handleConnect(wallet, chainParams);
                        setWalletVisibility(false);
                      } catch (error) {
                        setShowError(true);
                      }
                    }}
                    isActive={isActive}
                    walletName={wallet.wallet}
                  >
                    {wallet.wallet === 'METAMASK' ? (
                      <MetamaskLogo size={30} />
                    ) : wallet.wallet === Wallet.COINBASE ? (
                      <CoinbaseIcon height={30} width={30} />
                    ) : (
                      <WalletConnectLogo size={30} />
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
