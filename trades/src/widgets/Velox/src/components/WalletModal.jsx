import 'twin.macro';

import { SUPPORTED_WALLETS, useWallets } from '@romeblockchain/wallet';
import { MetaMask } from '@web3-react/metamask';

import MetamaskLogo from '../../../../components/icons/MetamaskLogo';
import WalletConnectLogo from '../../../../components/icons/WalletConnectLogo';
import { EventGroups, sendStatelessEvent } from '../../../../contexts';
import { WalletBox } from '../../../../contexts/WalletsContext/WalletSelectionModal';

const WalletModal = () => {
  const { selectedWallet, setSelectedWallet } = useWallets();

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

            return (
              <WalletBox
                key={index}
                connectHandler={async () => {
                  sendStatelessEvent(
                    'Wallet_Successful_Connection',
                    EventGroups.WalletConnection
                  );
                  sendStatelessEvent(
                    `${wallet.wallet.replace(' ', '_')}_Successful_Connection`,
                    EventGroups.WalletConnection
                  );
                  if (wallet.connector instanceof MetaMask) {
                    wallet.connector
                      .activate()
                      .then(() => setSelectedWallet(wallet.wallet));
                  } else {
                    if (typeof chainParams === 'number') {
                      wallet.connector
                        .activate()
                        .then(() => setSelectedWallet(wallet.wallet));
                    } else {
                      wallet.connector
                        .activate()
                        .then(() => setSelectedWallet(wallet.wallet));
                    }
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
