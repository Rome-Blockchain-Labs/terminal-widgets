import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

import { HASURA_ADMIN_SECRET, HASURA_API_ENDPOINT_WS } from '../config';

const headers: { 'x-hasura-admin-secret'?: string } = {};
const websockerUrl = HASURA_API_ENDPOINT_WS;
const httpUrl = websockerUrl && websockerUrl.replace('ws', 'http');

const adminSecret = HASURA_ADMIN_SECRET;
if (adminSecret) {
  headers['x-hasura-admin-secret'] = adminSecret;
}

const httpLink = new HttpLink({
  headers,
  uri: httpUrl,
});

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  options: {
    connectionParams: {
      headers,
    },
    reconnect: true,
  },
  uri: websockerUrl || '',
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

export default client;
