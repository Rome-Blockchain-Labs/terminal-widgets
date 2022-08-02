import 'twin.macro';

import { getAddress } from '@ethersproject/address';
import { useWeb3React } from '@web3-react/core';
import React from 'react';

import { usePageContext } from '../PageContext';

const Address = () => {
  const { account } = useWeb3React();
  const shortenedAddress = account && shortenAddress(account);

  const { setWalletVisibility } = usePageContext();

  if (!account) {
    return null;
  }

  return (
    <div tw="w-full flex mb-3 max-w-sm md:max-w-full">
      <button
        tw="h-11 rounded-full bg-yellow-200 text-black grid place-items-center p-2 border  ml-auto"
        onClick={() => setWalletVisibility(true)}
      >
        {shortenedAddress}
      </button>
    </div>
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
function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address);
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
}
