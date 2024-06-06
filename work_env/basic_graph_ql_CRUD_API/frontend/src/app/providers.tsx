// app/providers.tsx

'use client';

import { ApolloProvider } from '@apollo/client';
import createApolloClient from '../../lib/apolloClient';
import React from 'react';

const Providers = ({ children }: { children: React.ReactNode }) => {
  const client = createApolloClient();
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default Providers;
