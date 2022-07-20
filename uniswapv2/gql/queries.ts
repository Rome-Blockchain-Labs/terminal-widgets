import { gql } from '@apollo/client';

import { NetworkName } from '../constants/networkExchange';

export const getLatestPriceQuery = (blockchain: NetworkName) => gql`
  query LatestPriceQuery(
    $exchange: String
    $pairAddress: String
    $baseToken: String
    $quoteToken: String
    $resolution: Int
    $isUSDView: Boolean!
  ) {
    prices: ${blockchain}_swap_candles_cached(
      order_by: { candle_start: desc }
      limit: 1
      where: {
        exchange: { _eq: $exchange }
        pair_address: { _eq: $pairAddress }
        base_token: { _eq: $baseToken }
        quote_token: { _eq: $quoteToken }
        resolution_seconds: { _eq: $resolution }
      }
    ) {
      candle_start
      close @skip(if: $isUSDView)
      high @skip(if: $isUSDView)
      low @skip(if: $isUSDView)
      open @skip(if: $isUSDView)
      close_usd @include(if: $isUSDView)
      high_usd @include(if: $isUSDView)
      low_usd @include(if: $isUSDView)
      open_usd @include(if: $isUSDView)
    }
  }
`;

export const getFirstSwapQuery = (blockchain: NetworkName) => gql`
  query minTimestamp($exchange: String, $pairAddress: String, $token0: String, $token1: String, $resolution_seconds: Int)
  @cached {
    prices: ${blockchain}_swap_candles_cached_aggregate(
      where: {
        exchange: { _eq: $exchange }
        resolution_seconds: { _eq: $resolution_seconds }
        base_token: { _eq: $token0 }
        quote_token: { _eq: $token1 }
        pair_address: { _eq: $pairAddress }
      }
    ) {
      aggregate {
        min {
          candle_start
        }
      }
    }
  }
`;

export const getSubscribePricesQuery = (blockchain: NetworkName) => gql`
  subscription SubscribePricesQuery(
    $exchange: String!
    $pairAddress: String!
    $baseToken: String!
    $quoteToken: String!
    $resolution: Int!
    $isUSDView: Boolean!
  ) {
    prices: ${blockchain}_get_swap_candles (
      order_by: { candle_start: desc }
      limit: 4
      args: {
        _exchange: $exchange
        _pair_address: $pairAddress
        _base_token: $baseToken
        _quote_token: $quoteToken
        _resolution: $resolution
      }
    ) {
      candle_start
      close @skip(if: $isUSDView)
      high @skip(if: $isUSDView)
      low @skip(if: $isUSDView)
      open @skip(if: $isUSDView)
      close_usd @include(if: $isUSDView)
      high_usd @include(if: $isUSDView)
      low_usd @include(if: $isUSDView)
      open_usd @include(if: $isUSDView)
      usd_volume
      generation_time
    }
  }
`;

export const GetPricesQuery = (blockchain: NetworkName) => gql`
  query PricesQuery(
    $exchange: String
    $pairAddress: String
    $baseToken: String
    $quoteToken: String
    $fromDate: Int
    $toDate: Int
    $resolution: Int
    $isUSDView: Boolean!
  ) {
    prices: ${blockchain}_swap_candles_cached(
      order_by: { candle_start: asc }
      where: {
        exchange: { _eq: $exchange }
        pair_address: { _eq: $pairAddress }
        base_token: { _eq: $baseToken }
        quote_token: { _eq: $quoteToken }
        resolution_seconds: { _eq: $resolution }
        candle_start: { _gte: $fromDate, _lte: $toDate }
      }
    ) {
      candle_start
      close @skip(if: $isUSDView)
      high @skip(if: $isUSDView)
      low @skip(if: $isUSDView)
      open @skip(if: $isUSDView)
      close_usd @include(if: $isUSDView)
      high_usd @include(if: $isUSDView)
      low_usd @include(if: $isUSDView)
      open_usd @include(if: $isUSDView)
      usd_volume
      generation_time
    }
  }
`;

export const getSearchPairsByKeywordQuery = (blockchain: NetworkName) => gql`
  query SearchPairsByKeyword($exchange: String, $input: String) {
    pairs: ${blockchain}_pair_search(
      where: { exchange: { _eq: $exchange }, concat_ws: { _ilike: $input } }
      limit: 50
      order_by: { last_24hour_usd_volume: desc_nulls_last }
    ) {
      exchange
      pair_address
      token1_address
      token0_address
      token0 {
        primary_img_uri
        name
        symbol
        decimals
      }
      token1 {
        primary_img_uri
        name
        symbol
        decimals
      }
      last_24hour_usd_volume
    }
  }
`;

export const getPairSwapSubscription = (blockchain: NetworkName) => gql`
  subscription OnSwapQuery(
    $exchange: String
    $pairAddress: String
    $baseToken: String
    $quoteToken: String
    $limit: Int
  ) {
    swap: ${blockchain}_tokenswaps_with_prices(
      order_by: { timestamp: desc }
      limit: $limit
      where: {
        exchange: { _eq: $exchange }
        base_token: { _eq: $baseToken }
        quote_token: { _eq: $quoteToken }
        pair_address: { _eq: $pairAddress }
        swapindex: { _gte: 0 }
        unusual: { _eq: false }
      }
    ) {
      txhash
      timestamp
      direction
      base_token
      quote_token
      price
      base_amount
      swapindex
      quote_amount
      native_price
      usd_price
      base_decimals
      quote_decimals
    }
  }
`;

export const getPairSwapQuery = (blockchain: NetworkName) => gql`
  query GetSwapQuery(
    $exchange: String
    $baseToken: String
    $quoteToken: String
    $pairAddress: String
    $limit: Int
    $offset: Int
    $orderBy: [${blockchain}_tokenswaps_with_prices_order_by!]
  ) {
    swap: ${blockchain}_tokenswaps_with_prices(
      order_by: $orderBy
      where: {
        exchange: { _eq: $exchange }
        base_token: { _eq: $baseToken }
        quote_token: { _eq: $quoteToken }
        pair_address: { _eq: $pairAddress }
        swapindex: { _gte: 0 }
        unusual: { _eq: false }
      }
      limit: $limit
      offset: $offset
    ) {
      txhash
      timestamp
      direction
      base_token
      quote_token
      price
      base_amount
      swapindex
      quote_amount
      native_price
      usd_price
      base_decimals
      quote_decimals
    }
  }
`;
