import { useEffect, useState, useRef } from 'react';
import Web3 from 'web3';
import { useWeb3React } from '@romeblockchain/wallet';
import getWeb3NoAccount from './getWeb3NoAccount';

const useWeb3 = () => {
  const { provider } = useWeb3React();
  const refEth = useRef(provider);
  const [web3, setWeb3] = useState(provider ? new Web3(Web3.givenProvider) : getWeb3NoAccount());

  useEffect(() => {
    if (provider !== refEth.current) {
      setWeb3(provider ? new Web3(Web3.givenProvider) : getWeb3NoAccount());
      refEth.current = provider;
    }
  }, [provider]);

  return web3;
};

export default useWeb3;
