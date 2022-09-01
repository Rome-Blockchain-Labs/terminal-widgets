import { gql } from '@apollo/client';

export const SEARCH_PAIR_BY_TOKENS = gql`
  query SearchPairByTokens(
    $exchange: String
    $token0: String
    $token1: String
  ) {
    pairs: avalanche_pair_search(
      where: {
        exchange: { _eq: $exchange }
        token0: { address: { _eq: $token0 } }
        token1: { address: { _eq: $token1 } }
      }
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
