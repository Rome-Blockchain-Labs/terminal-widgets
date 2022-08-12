import 'twin.macro';

import { useWallets, useWeb3React } from '@romeblockchain/wallet';
import React, { useContext } from 'react';
import { useSelector } from 'react-redux';

import { CloseIcon } from '../../../../components/icons';
import { AppState } from '../../../../store';
import { ApplicationModal } from '../../state/application/actions';
import {
  useModalOpen,
  useWalletModalToggle,
} from '../../state/application/hooks';
import { useAddressModalToggle } from '../../state/application/hooks';
import { shortenAddress } from '../../utils';

const AddressModal = () => {
  const { account, connector } = useWeb3React();
  const { selectedWallet, setSelectedWallet } = useWallets();

  // const open = useModalOpen(ApplicationModal.ADDRESS)
  const openModal = useSelector(
    (state: AppState) => state.dapps.dmm.application.addressOpenModal
  );
  const toggle = useWalletModalToggle();
  const toggleAddress = useAddressModalToggle();
  // const { widgetBridge } = useIFrameContext();
  if (!openModal) {
    return null;
  }

  return (
    <>
      <div tw="fixed top-0 z-20 w-full h-full bg-black bg-opacity-80" />
      <div tw="fixed top-0 w-full h-full z-30 flex justify-center items-center">
        <div tw="mx-3 p-6 w-full h-1/2 min-h-[215px] md:mx-0 md:w-1/2 bg-dark-500 flex flex-wrap justify-center items-center rounded-10 h-fit-content max-w-lg">
          <div tw="w-full text-yellow-400 flex">
            <span>Account</span>
            <button tw="ml-auto mr-3 " onClick={toggleAddress}>
              <CloseIcon color="#C1FF00" height={17} width={17} />
            </button>
          </div>
          <hr tw="w-full bg-gray-50 mt-2" />
          {selectedWallet && (
            <div tw="capitalize w-full">
              Connected with {selectedWallet.toLowerCase().replaceAll('_', ' ')}
            </div>
          )}
          {account && (
            <div tw="w-full font-semibold">{shortenAddress(account)}</div>
          )}
          <div tw="flex w-full justify-center px-2 gap-4 h-9 mt-2">
            <button
              tw="flex-1 bg-gray-800 text-yellow-400 h-full"
              onClick={async () => {
                try {
                  if (connector && connector.deactivate) {
                    await connector.deactivate();
                    window.localStorage.clear();
                  } else {
                    await connector.resetState();
                  }
                } catch (error) {}
                setSelectedWallet(undefined);
                toggle();
                toggleAddress();
              }}
            >
              Disconnect
            </button>
            <button
              tw="flex-1 bg-gray-800 text-yellow-400 h-full"
              onClick={() => {
                toggle();
                toggleAddress();
              }}
            >
              Change
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddressModal;
