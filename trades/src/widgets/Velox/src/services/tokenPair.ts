import { gql } from 'graphql-request';
import memoizeOne from 'memoize-one';

import { romePairsClient, veloxPairsClient } from './graphqlClients';

export interface TokenPair {
  token0_address: string;
  token1_address: string;
}

//optional to filter out tokens with 0 liquidity to native token
// direct_pairs_with_required_token: ${blockchain}_pair_summary(where:{_and:[{exchange: {_ilike: $exchange}, _or: [{token0_address: {_ilike: $requiredDirectPairWithToken}}, {token1_address: {_ilike: $requiredDirectPairWithToken}}]}, {_not:{_or: [{token0_pooled:{_eq:0}},{token1_pooled:{_eq:0}}]}}]}) {

const getSearchTokenQueryVelox = (tableSuffix: string) => {
  return gql`
query getSearchTokenQueryVelox($requiredDirectPairWithToken: String!) {
  direct_pairs_with_required_token: pairs${tableSuffix}(where: {_or: [{token0_address: {_ilike: $requiredDirectPairWithToken}}, {token1_address: {_ilike: $requiredDirectPairWithToken}}]}) {
    token0_address
    token1_address
  }
}
`;
};
const getSearchTokenQueryRome = (blockchain: string) => {
  return gql`
query getSearchTokenQueryRome($exchange: String!, $requiredDirectPairWithToken: String!) {
  direct_pairs_with_required_token: ${blockchain}_pair_summary(where: {_and: [{exchange: {_ilike: $exchange}, _or: [{token0_address: {_ilike: $requiredDirectPairWithToken}}, {token1_address: {_ilike: $requiredDirectPairWithToken}}]}]}) {
    token0_address
    token1_address
  }
}
`;
};

export const getDirectPairsVelox = memoizeOne(
  async (tableSuffix: string, requiredDirectPairWithToken: string) => {
    const query = getSearchTokenQueryVelox(tableSuffix);
    const res = await veloxPairsClient.request(query, {
      requiredDirectPairWithToken,
    });
    return res;
  }
);

export const getDirectPairsRome = memoizeOne(
  async (
    blockchain: string,
    exchange: string,
    requiredDirectPairWithToken: string
  ) => {
    const query = getSearchTokenQueryRome(blockchain);
    const res = await romePairsClient.request(query, {
      exchange,
      requiredDirectPairWithToken,
    });
    return res;
  }
);
