import { Interface } from '@ethersproject/abi';
import { ExchangeName } from '@rbl/velox-common/multiChains';
import {
  Currency,
  FACTORY_ADDRESS,
  INIT_CODE_HASH,
  Pair,
  TokenAmount,
} from '@rbl/velox-common/uniV2ClonesSDK';
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json';
import { useContext, useMemo } from 'react';

import { mapThisNetworkINIT_CODE_HASHNameToMultiChainNetwork } from '../../../constants/networkExchange/tempMaps';
import { DappContext } from '../../../contexts';
import { useWallets } from '../../../contexts/WalletsContext/WalletContext';
import { wrappedCurrency } from '../../../utils';
import { useMultipleContractSingleData } from '../state/multicall/hooks';

const PAIR_INTERFACE = new Interface(IUniswapV2PairABI);

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

//todo refactor so this is not necessary
const getExchangeNameFromExchange = (exchange: ExchangeName | undefined) => {
  switch (exchange) {
    case 'PANCAKESWAP': //defined in velox-common/multicall NetworkName
      return 'PancakeSwap'; //defined in velox-common/uniV2ClonesSDK/ INIT_CODE_HASH key
    case 'PANGOLIN':
      return 'Pangolin';
    case 'TRADERJOE':
      return 'TraderJoe';
    case 'BISWAP':
      return 'BiSwap';
    case 'MDEX':
      return 'MDex';
    case 'SOLARBEAM':
      return 'SolarBeam';
    case 'NETSWAP':
      return 'Netswap';
    case 'SUSHISWAP':
      return 'SushiSwap';
    case 'UNISWAPV2':
      return 'UniswapV2';
    case 'BEAMSWAP':
      return 'BeamSwap';
    case 'CRYSTALVALE':
      return 'Crystalvale';
    default:
      return '';
  }
};

export function usePairs(
  currencies: [Currency | undefined, Currency | undefined][]
): [PairState, Pair | null][] {
  const { chainId } = useWallets();
  const { exchange, network } = useContext(DappContext);
  const exchangeName = getExchangeNameFromExchange(exchange);
  const networkName =
    mapThisNetworkINIT_CODE_HASHNameToMultiChainNetwork(network);

  if (!chainId) {
    //this should be refactored out
    throw new Error(
      'chainId from the wallet is currently required to use the uniswapv2 component'
    );
  }

  const factoryAddress = FACTORY_ADDRESS[chainId][exchangeName];
  const initCodeHash = INIT_CODE_HASH[networkName][exchangeName];

  if (!factoryAddress || !initCodeHash) {
    throw new Error(
      `unknown factory at chainId:${chainId} network:${networkName}  exchange:${exchangeName}`
    );
  }

  const tokens = useMemo(
    () =>
      currencies.map(([currencyA, currencyB]) => [
        wrappedCurrency(currencyA, chainId),
        wrappedCurrency(currencyB, chainId),
      ]),
    [chainId, currencies]
  );
  const pairAddresses = useMemo(
    () =>
      tokens.map(([tokenA, tokenB]) => {
        return tokenA && tokenB && !tokenA.equals(tokenB)
          ? Pair.getAddress(tokenA, tokenB, factoryAddress, initCodeHash)
          : undefined;
      }),
    [tokens, factoryAddress, initCodeHash]
  );

  const results = useMultipleContractSingleData(
    pairAddresses,
    PAIR_INTERFACE,
    'getReserves'
  );

  return useMemo(() => {
    return results.map((result, i) => {
      const { loading, result: reserves } = result;
      const tokenA = tokens[i][0];
      const tokenB = tokens[i][1];

      if (loading) return [PairState.LOADING, null];
      if (!tokenA || !tokenB || tokenA.equals(tokenB))
        return [PairState.INVALID, null];
      if (!reserves) return [PairState.NOT_EXISTS, null];
      const { reserve0, reserve1 } = reserves;
      const [token0, token1] = tokenA.sortsBefore(tokenB)
        ? [tokenA, tokenB]
        : [tokenB, tokenA];
      return [
        PairState.EXISTS,
        new Pair(
          new TokenAmount(token0, reserve0.toString()),
          new TokenAmount(token1, reserve1.toString()),
          factoryAddress,
          initCodeHash
        ),
      ];
    });
  }, [results, tokens, factoryAddress, initCodeHash]);
}

export function usePair(
  tokenA?: Currency,
  tokenB?: Currency
): [PairState, Pair | null] {
  return usePairs([[tokenA, tokenB]])[0];
}
