import 'twin.macro';

import { getAddress } from '@ethersproject/address';
import { useWeb3React } from '@web3-react/core';
import React from 'react';

import { useAddressModalToggle } from '../../state/application/hooks';

const Address = () => {
  const { account } = useWeb3React();
  const shortenedAddress = account && shortenAddress(account);

  const toggleAddress = useAddressModalToggle();

  if (!account) {
    return null;
  }

  return (
    <div tw="w-full flex mb-3 max-w-2xl ">
      <button
        tw="h-11 rounded-full bg-yellow-200 text-black grid place-items-center p-2 border  ml-auto"
        onClick={toggleAddress}
      >
        {shortenedAddress}
      </button>
    </div>
  );
};

export default Address;

// returns the checksummed address if the address is valid, otherwise returns false
function parseAddress(value: any): string | undefined {
  try {
    return getAddress(value);
  } catch {
    return;
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = parseAddress(address);
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
}
