import { getWrappedNativeToken } from '@rbl/velox-common/multiChains';
import axios from 'axios';
import BN from 'bignumber.js';
import * as ethers from 'ethers';
import { stringify } from 'flatted';
import { gql } from 'graphql-request';
import { flatten, keyBy } from 'lodash';

import { strategyApiKey, strategyApiUri } from '../config';
import {
  rinkebyUniswap,
  sushiswap,
  uniswapV2,
} from '../containers/exchangeSelector/allowableExchanges';
import { allowableExchanges } from '../model/model';
import { Strategy } from '../model/strategy';
import { calculateTrigger } from '../redux/strategy/mapStrategyData';
import { romePairsClient, veloxPairsClient } from './graphqlClients';
import {
  getDirectPairsRome,
  getDirectPairsVelox,
  TokenPair,
} from './tokenPair';

const ethersStrategyAddType = {
  Strategy: [
    { name: 'chainId', type: 'uint' },
    { name: 'exchange', type: 'string' },
    { name: 'identifier', type: 'string' },
    { name: 'userAddress', type: 'address' },
    { name: 'tokenInAddress', type: 'address' },
    { name: 'tokenOutAddress', type: 'address' },
    { name: 'tokenInAmount', type: 'uint' },
  ],
};

export async function signAddRequest(
  provider: any,
  strategy: Partial<Strategy>
) {
  const signer = provider.getSigner();
  return await signer._signTypedData(undefined, ethersStrategyAddType, {
    chainId: Number(strategy.chainId),
    exchange: strategy.exchange,
    identifier: strategy.identifier,
    tokenInAddress: strategy.tokenInAddress,
    tokenInAmount: strategy.tokenInAmount,
    tokenOutAddress: strategy.tokenOutAddress,
    userAddress: strategy.userAddress,
  });
}

const ethersStrategyDeleteType = {
  Strategy: [
    { name: 'identifier', type: 'string' },
    { name: 'userAddress', type: 'address' },
  ],
};
export async function signDeleteRequest(
  provider: any,
  identifier: string,
  userAddress: string
) {
  const signer = provider.getSigner();
  return await signer._signTypedData(undefined, ethersStrategyDeleteType, {
    identifier: identifier.toString(),
    userAddress: userAddress,
  });
}

export const searchTokenByPairAddressAsync = async (
  searchString: string,
  selectedExchange: allowableExchanges
) => {
  return (
    await searchTokensAsync(searchString, selectedExchange, {
      nilVolumeOkay: true,
    })
  )[0];
};

interface getSearchTokenQueryResult {
  // prettier-ignore
  pair_search: {
    pair: {
      id: string;
      token0: {
        address: string;
        symbol: string;
        name: string;
        decimals: number;
        id: string;
        image: string;
      };
      token1: {
        address: string;
        symbol: string;
        name: string;
        decimals: number;
        id: string;
        image: string;
      };
      pair_volumes: {
        volume_usd: string;
        daily_volume_usd: string;
        token0_price: string;
        token1_price: string;
      };
    };
  }[];
}
const getSearchTokenQuery = (tableSuffix: string) => {
  return gql`
  query SearchTokens($text: String!) {
    pair_search:pair_search${tableSuffix}(where: { concat_ws: { _ilike: $text } }, limit: 500, order_by: { daily_volume_usd:desc_nulls_last, volume_usd: desc_nulls_last }) {
      pair {
        id: pair_address
        token0 {
          address
          symbol
          name
          decimals
          id: address
          image: primary_img_uri
        }
        token1 {
          address
          symbol
          name
          decimals
          id: address
          image: primary_img_uri
        }
        pair_volumes {
          volume_usd
          daily_volume_usd
          token0_price
          token1_price
        }
      }
    }
  }
`;
};

interface romeSearchTokenQueryResult {
  // prettier-ignore
  pair_search: {
    id: string;
    token0: {
      address: string;
      symbol: string;
      name: string;
      decimals: number;
      id: string;
      image: string;
    };
    token1: {
      address: string;
      symbol: string;
      name: string;
      decimals: number;
      id: string;
      image: string;
    };
    last_24hour_usd_volume: string;
    latest_token0_usd_price: string;
    latest_token1_usd_price: string;
  }[];
  // prettier-ignore
  direct_pairs_with_required_token: {
    token0_address: string;
    token1_address: string;
  }[]
}
const getRomeSearchTokenQuery = (blockchain: string, exchange: string) => {
  return gql`
  query SearchTokens($exchange: String!, $searchText: String!) {
    pair_search: ${blockchain}_pair_search(where: {concat_ws: {_ilike: $searchText}, exchange: {_ilike: $exchange}}, limit: 500, order_by: { last_24hour_usd_volume: desc_nulls_last }) {
      id: pair_address
      token0 {
        address
        symbol
        name
        decimals
        id: address
        image: primary_img_uri
      }
      token1 {
        address
        symbol
        name
        decimals
        id: address
        image: primary_img_uri
      }
      last_24hour_usd_volume
      latest_token0_usd_price
      latest_token1_usd_price
    }
}
`;
};

const getTokenNamesVelox = gql`
  query getTokenNames($tokenAddresses: [String!]!) {
    tokens(where: { address: { _in: $tokenAddresses } }) {
      address
      name
      symbol
      primary_img_uri
    }
  }
`;

const getTokenNamesRome = gql`
  query getAvalancheTokenNames($tokenAddresses: [String!]!) {
    tokensAvalanche: avalanche_tokens(
      where: { address: { _in: $tokenAddresses } }
    ) {
      address
      name
      symbol
      primary_img_uri
    }
    tokensBsc: bsc_tokens(where: { address: { _in: $tokenAddresses } }) {
      address
      name
      symbol
      primary_img_uri
    }
  }
`;

export const getTokenNameDictionary = async (tokenAddresses: Array<string>) => {
  const checkSummedAddresses = tokenAddresses.map(ethers.utils.getAddress);
  const resVelox = await veloxPairsClient.request(getTokenNamesVelox, {
    tokenAddresses: checkSummedAddresses,
  });
  const resRome = await romePairsClient.request(getTokenNamesRome, {
    tokenAddresses: checkSummedAddresses,
  });

  return {
    Avalanche: keyBy(resRome.tokensAvalanche, (d) => d.address.toLowerCase()),
    BSC: keyBy(resRome.tokensBsc, (d) => d.address.toLowerCase()),
    Ethereum: keyBy(resVelox.tokens, (d) => d.address.toLowerCase()),
  };
};

//TODO: This should be unified in the future
//We are going to use the romenet token database moving forward
export const searchTokensAsync = async (
  searchString: string,
  selectedExchange: allowableExchanges,
  config = { nilVolumeOkay: false }
) => {
  if (
    selectedExchange.key === uniswapV2.key ||
    selectedExchange.key === rinkebyUniswap.key ||
    selectedExchange.key === sushiswap.key
  )
    return await searchTokensAsyncVelox(searchString, selectedExchange, config);
  //pangolin
  //traderjoe
  //pancakeswap
  else
    return await searchTokensAsyncRome(searchString, selectedExchange, config);
};

export const addStrategyAsync = async (provider: any, strategy: Strategy) => {
  const signedMessage = await signAddRequest(provider, strategy);
  const trigger = calculateTrigger(strategy);
  return await axios.post(
    strategyApiUri + '/strategies',
    {
      ...strategy,
      signedMessage,
      trigger,
    },
    { headers: { 'api-key': strategyApiKey } }
  );
};

export const getUserStrategiesAsync = async (
  userAddress: string,
  auth: { message: string; signedMessage: string }
) => {
  const res = await axios.get(strategyApiUri + '/strategies', {
    headers: { 'api-key': strategyApiKey },
    params: {
      message: auth.message,
      signedMessage: auth.signedMessage,
      userAddress,
    },
  });
  return res?.data?.strategies || [];
};

export const deleteStrategyAsync = async (
  provider: any,
  userAddress: string,
  identifier: string
) => {
  const signedMessage = await signDeleteRequest(
    provider,
    identifier,
    userAddress
  );
  return await axios.delete(strategyApiUri + '/strategies', {
    data: { identifier, signedMessage, userAddress },
    headers: { 'api-key': strategyApiKey },
  });
};

async function searchTokensAsyncVelox(
  searchString: string,
  selectedExchange: allowableExchanges,
  config: { nilVolumeOkay: boolean }
) {
  const text = searchString ? `%${searchString}%` : '%0x%'; //empty string turns to 0x which is found by every pair
  const wrappedNativeTokenAddress = getWrappedNativeToken(
    selectedExchange.identifiers.blockchain,
    selectedExchange.identifiers.chainId
  );
  const parameters = { text };
  const query = getSearchTokenQuery(selectedExchange.tableSuffix);
  let res: getSearchTokenQueryResult;
  let direct_pairs_with_required_token: Array<TokenPair>;
  try {
    res = await veloxPairsClient.request(query, parameters);
    direct_pairs_with_required_token = (
      await getDirectPairsVelox(
        selectedExchange.tableSuffix,
        wrappedNativeTokenAddress
      )
    ).direct_pairs_with_required_token;
  } catch (e) {
    throw new Error(
      `${stringify(e, Object.getOwnPropertyNames(e))}, args:${stringify({
        parameters,
        query,
      })}`
    );
  }
  const { pair_search } = res;
  const tokensWithPairToWrappedNativeToken = keyBy(
    flatten(
      direct_pairs_with_required_token.map(
        (pair: { token0_address: string; token1_address: string }) => [
          pair.token0_address,
          pair.token1_address,
        ]
      )
    )
  );
  const mappedPairs = pair_search
    .filter(({ pair }) => {
      return (
        (config.nilVolumeOkay ||
          searchString.startsWith('0x') ||
          Number(pair?.pair_volumes?.volume_usd)) &&
        pair.pair_volumes?.token0_price &&
        pair.pair_volumes?.token1_price &&
        pair.token0 &&
        pair.token1 &&
        tokensWithPairToWrappedNativeToken[pair.token0.address] &&
        tokensWithPairToWrappedNativeToken[pair.token1.address]
      );
    })
    .map(({ pair }) => ({
      ...pair,
      token0Price: pair.pair_volumes?.token0_price,
      token1Price: pair.pair_volumes?.token1_price,
      volumeUSD: pair.pair_volumes?.daily_volume_usd,
    }));
  return mappedPairs;
}

async function searchTokensAsyncRome(
  searchString: string,
  selectedExchange: allowableExchanges,
  config: { nilVolumeOkay: boolean }
) {
  const searchText = searchString ? `%${searchString}%` : '%0x%'; //empty string turns to 0x which is found by every pair
  const wrappedNativeTokenAddress = getWrappedNativeToken(
    selectedExchange.identifiers.blockchain,
    selectedExchange.identifiers.chainId
  );
  const parameters = {
    exchange: selectedExchange.identifiers.exchange,
    searchText,
  };
  const blockchain = selectedExchange.identifiers.blockchain.toLowerCase();
  const exchange = selectedExchange.identifiers.exchange.toLowerCase();
  const query = getRomeSearchTokenQuery(blockchain, exchange);

  let res: romeSearchTokenQueryResult;
  let direct_pairs_with_required_token: Array<TokenPair>;
  try {
    res = await romePairsClient.request(query, parameters);
    direct_pairs_with_required_token = (
      await getDirectPairsRome(blockchain, exchange, wrappedNativeTokenAddress)
    ).direct_pairs_with_required_token;
  } catch (e) {
    throw new Error(
      `${stringify(e, Object.getOwnPropertyNames(e))}, args:${stringify({
        parameters,
        query,
      })}`
    );
  }
  const { pair_search } = res;

  const tokensWithPairToWrappedNativeToken = keyBy(
    flatten(
      direct_pairs_with_required_token.map(
        (pair: { token0_address: string; token1_address: string }) => [
          pair.token0_address,
          pair.token1_address,
        ]
      )
    )
  );

  const mappedPairs = pair_search
    .filter((pair) => {
      return (
        // (config.nilVolumeOkay || searchString.startsWith("0x") || Number(pair?.last_24hour_usd_volume)) &&
        pair.token0 &&
        pair.token1 &&
        tokensWithPairToWrappedNativeToken[pair.token0.address] &&
        tokensWithPairToWrappedNativeToken[pair.token1.address]
      );
    })
    .map((pair) => {
      const tokenPrices =
        pair.latest_token0_usd_price && pair.latest_token1_usd_price
          ? {
              token0Price: new BN(pair.latest_token1_usd_price)
                .dividedBy(pair.latest_token0_usd_price)
                .toString(),
              token1Price: new BN(pair.latest_token0_usd_price)
                .dividedBy(pair.latest_token1_usd_price)
                .toString(),
            }
          : {
              token0Price: 1,
              token1Price: 1,
            };

      return {
        ...pair,
        volumeUSD: pair.last_24hour_usd_volume,
        ...tokenPrices,
      };
    });
  return mappedPairs;
}
