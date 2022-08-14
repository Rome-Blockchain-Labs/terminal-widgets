import 'twin.macro';

import { RomeEventType } from '@romeblockchain/bridge';
import {
  getAddChainParameters,
  SUPPORTED_WALLETS,
  useWallets,
} from '@romeblockchain/wallet';
import { MetaMask } from '@web3-react/metamask';
import { ethers } from 'ethers';

import MetamaskLogo from '../../../../components/icons/MetamaskLogo';
import WalletConnectLogo from '../../../../components/icons/WalletConnectLogo';
import { EventGroups } from '../../../../contexts';
import { WalletBox } from '../../../../contexts/WalletsContext/WalletSelectionModal';
import { useIFrameContext } from './IFrameProvider';

const WalletModal = () => {
  const { selectedWallet, setSelectedWallet } = useWallets();
  const { widgetBridge } = useIFrameContext();

  return (
    <>
      <div tw="fixed top-0 z-20 w-full h-full bg-black bg-opacity-80" />
      <div tw="fixed top-0 w-full h-full z-30 flex justify-center items-center">
        <div tw="mx-3 p-6 w-full min-h-[215px] md:mx-0 md:w-1/2 bg-dark-500 flex flex-wrap justify-center items-center rounded-10 h-fit-content max-w-lg">
          <div tw="w-full text-yellow-400 flex">
            <span>CONNECT / SWITCH TO A WALLET</span>
          </div>
          <hr tw="w-full bg-gray-50 mt-2" />
          {Object.keys(SUPPORTED_WALLETS).map((key, index) => {
            const wallet = SUPPORTED_WALLETS[key];
            const isActive = selectedWallet === wallet.wallet;
            const chainParams = getAddChainParameters(43114);

            return (
              <WalletBox
                key={index}
                connectHandler={async () => {
                  await handleConnect(
                    wallet.connector,
                    setSelectedWallet,
                    wallet.wallet,
                    widgetBridge,
                    chainParams
                  );
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

export const handleConnect = async (
  connector,
  setSelectedWallet,
  wallet,
  widgetBridge,
  chainParams
) => {
  if (connector instanceof MetaMask) {
    let error;
    //Metamask will automatically add the network if doesnt no
    await connector.activate(chainParams).catch(() => (error = true));
    if (error) return;
  } else {
    if (typeof chainParams === 'number') {
      let error;

      await connector.activate(chainParams).catch(() => (error = true));
      if (error) return;
      connector.provider?.once('chainChanged', () => {
        setSelectedWallet(wallet);
        connector.provider?.removeListener('chainChanged', () => {});
      });
    } else {
      let error;
      // error would return true if user rejects the wallet connection request
      // if network doesnt exist yet connector.activate would not throw an error and still successsfully activate
      await connector
        .activate(chainParams && chainParams.chainId)
        .catch(() => (error = true));

      if (error) return;

      // activate needs to occur before wallet_addEthereumChain because we can only make requests with an active
      // connector.
      // calling wallet_addEthereumChain will check if the chainId is already present in the wallet
      // if the chainId alreaady exists then it wont add the duplicate network to the wallet
      chainParams &&
        (await connector.provider?.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              ...chainParams,
              chainId: ethers.utils.hexValue(chainParams.chainId),
            },
          ],
        }));

      // we need to subscribe to chainChanged because we would only want to switch selectedWallet when
      // the user has switched networks especially when the netork is newly added
      connector.provider?.once('chainChanged', () => {
        setSelectedWallet(wallet);
        connector.provider?.removeListener('chainChanged', () => {});
      });
    }
  }

  // If wallet is already connected to the correct network then set wallet as priority wallet
  const chainId = await connector.provider?.request({
    method: 'eth_chainId',
  });

  if (!chainId) return;
  let targetChainId;
  if (typeof chainParams === 'number') {
    targetChainId = chainParams;
  } else {
    targetChainId = chainParams?.chainId;
  }

  if (targetChainId && chainId === ethers.utils.hexValue(targetChainId)) {
    setSelectedWallet(wallet);
  }
  if (targetChainId && chainId === targetChainId) {
    setSelectedWallet(wallet);
  }
  widgetBridge?.emit(RomeEventType.WIDGET_GOOGLE_ANALYTICS_EVENT, {
    event: `${wallet.replace(' ', '_')}_Successful_Connection`,
    eventGroup: EventGroups.WalletConnection,
  });
};
