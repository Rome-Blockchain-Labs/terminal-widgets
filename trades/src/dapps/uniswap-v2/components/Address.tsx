import 'twin.macro';

import { getAddress } from '@ethersproject/address';
import { useWallets, useWeb3React } from '@romeblockchain/wallet';
import { motion } from 'framer-motion';
import { useRef } from 'react';

import MetamaskLogo from '../../../components/icons/MetamaskLogo';
import WalletConnectLogo from '../../../components/icons/WalletConnectLogo';
import { usePageContext } from '../PageContext';

const Address = () => {
  const { account } = useWeb3React();
  const { selectedWallet } = useWallets();
  const shortenedAddress = account && shortenAddress(account);

  const { setAddressVisibility } = usePageContext();
  const isDragging = useRef(false);

  if (!account) {
    return null;
  }

  return (
    <motion.button
      className="group"
      drag="x"
      tw="absolute flex gap-x-3 top-2 left-2 z-10"
      onClick={() => {
        if (!isDragging.current) {
          setAddressVisibility(true);
        }
      }}
      onDragEnd={() => {
        setTimeout(() => {
          isDragging.current = false;
        }, 150);
      }}
      onDragStart={() => {
        isDragging.current = true;
      }}
    >
      {selectedWallet === 'METAMASK' ? (
        <MetamaskLogo tw="h-10 w-10 rounded-md border border-gray-500 bg-gray-400 p-2 text-white opacity-40 group-hover:opacity-80" />
      ) : (
        <WalletConnectLogo tw="h-10 w-10 rounded-md border border-gray-500 bg-gray-400 p-2 text-white opacity-40 group-hover:opacity-80" />
      )}

      <div tw="h-auto rounded-md border border-gray-500 bg-gray-400 p-2 text-white  hidden group-hover:block group-hover:opacity-80">
        {shortenedAddress}
      </div>
    </motion.button>
  );
};

export default Address;

// returns the checksummed address if the address is valid, otherwise returns false
function isAddress(value: any): string | false {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address);
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
}
