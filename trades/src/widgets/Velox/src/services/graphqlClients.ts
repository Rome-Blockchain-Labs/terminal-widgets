import { GraphQLClient } from 'graphql-request';

import { romeTokenSyncUri, tokenSyncUri } from '../config';

export const veloxPairsClient = new GraphQLClient(tokenSyncUri);
export const romePairsClient = new GraphQLClient(romeTokenSyncUri);
