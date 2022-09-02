import { gql } from '@apollo/client';

export const GET_PRICES = gql`
  query Prices(
    $exchange: String
    $baseToken: String
    $quoteToken: String
    $pairAddress: String
    $fromDate: Int
    $toDate: Int
    $resolution: Int
    $isUSDView: Boolean!
  ) {
    prices: avalanche_swap_candles_cached(
      order_by: { candle_start: asc }
      where: {
        exchange: { _eq: $exchange }
        base_token: { _eq: $baseToken }
        quote_token: { _eq: $quoteToken }
        pair_address: { _eq: $pairAddress }
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

export const GET_LATEST_PRICE = gql`
  query LatestPrice(
    $exchange: String
    $baseToken: String
    $quoteToken: String
    $pairAddress: String
    $resolution: Int
    $isUSDView: Boolean!
  ) {
    prices: avalanche_swap_candles_cached(
      order_by: { candle_start: desc }
      limit: 1
      where: {
        exchange: { _eq: $exchange }
        base_token: { _eq: $baseToken }
        quote_token: { _eq: $quoteToken }
        pair_address: { _eq: $pairAddress }
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

export const SUBSCRIBE_PRICES = gql`
  subscription SubscribePrices(
    $exchange: String!
    $pairAddress: String
    $baseToken: String!
    $quoteToken: String!
    $resolution: Int!
    $isUSDView: Boolean!
  ) {
    prices: avalanche_get_swap_candles(
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

export const FIRST_SWAP = gql`
  query minTimestamp(
    $exchange: String
    $pairAddress: String
    $token0: String
    $token1: String
    $resolutionSeconds: Int
  ) @cached {
    prices: avalanche_swap_candles_cached_aggregate(
      where: {
        exchange: { _eq: $exchange }
        resolution_seconds: { _eq: $resolutionSeconds }
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
