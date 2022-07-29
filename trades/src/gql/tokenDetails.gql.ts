import { gql } from '@apollo/client';

export const TokenDetailsQuery = gql`
  query TokenDetails(
    $base_token_lc: String!
    $quote_token_lc: String!
    $pair_address: String!
    $exchange: String!
  ) @cached {
    pair: avalanche_pair_summary(
      where: {
        exchange: { _eq: $exchange }
        pair_address: { _eq: $pair_address }
      }
    ) {
      exchange
      start_pair_price
      start_token1_native_price
      start_token1_usd_price
      start_token0_native_price
      start_token0_usd_price
      last_24hour_native_volume
      last_24hour_usd_volume
      latest_pair_price
      latest_token1_native_price
      latest_token1_usd_price
      latest_token0_native_price
      latest_token0_usd_price
      pair_address
      pair_creation_date
      token0_address
      token0_name
      token0_pooled
      token0_symbol
      token0_total_supply
      token1_address
      token1_name
      token1_pooled
      token1_symbol
      token1_total_supply
    }
    all_txs: avalanche_get_pair_tx_count(
      args: { _exchange: $exchange, _pair_address: $pair_address }
    ) {
      tx_count
    }
  }
`;
