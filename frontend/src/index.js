import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import client from './apolloClient';
import { ApolloProvider } from '@apollo/client';

const container = document.getElementById('root');
const root = createRoot(container); // Create a root.

root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
