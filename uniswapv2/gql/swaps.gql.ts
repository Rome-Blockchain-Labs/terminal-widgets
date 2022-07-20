import { gql } from '@apollo/client';

export const PAIR_SWAP_QUERY = gql`
  query GetSwap(
    $exchange: String
    $baseToken: String
    $quoteToken: String
    $pairAddress: String
    $limit: Int
    $offset: Int
    $orderBy: [avalanche_tokenswaps_with_prices_order_by!]
  ) {
    swap: avalanche_tokenswaps_with_prices(
      order_by: $orderBy
      where: {
        exchange: { _eq: $exchange }
        pair_address: { _eq: $pairAddress }
        base_token: { _eq: $baseToken }
        quote_token: { _eq: $quoteToken }
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
      quote_amount
      native_price
      usd_price
      base_decimals
      quote_decimals
    }
  }
`;
export const PAIR_SWAP_SUBSCRIPTION = gql`
  subscription OnSwap(
    $exchange: String
    $pairAddress: String
    $baseToken: String
    $quoteToken: String
    $limit: Int
  ) {
    swap: avalanche_tokenswaps_with_prices(
      order_by: { timestamp: desc }
      limit: $limit
      where: {
        exchange: { _eq: $exchange }
        pair_address: { _eq: $pairAddress }
        base_token: { _eq: $baseToken }
        quote_token: { _eq: $quoteToken }
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
