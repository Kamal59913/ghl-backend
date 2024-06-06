// lib/apolloClient.ts

import { ApolloClient, InMemoryCache } from '@apollo/client';

const createApolloClient = () => {
  const PORT = process.env.NEXT_PUBLIC_SERVER_URL || 5656;
  return new ApolloClient({
    uri: `http://localhost:${PORT}/graphql`, // Replace with your GraphQL endpoint
    cache: new InMemoryCache(),
  });
};

export default createApolloClient;
