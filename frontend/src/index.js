import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import client from './apolloClient';
import { ApolloProvider } from '@apollo/client';
import { Auth0Provider } from '@auth0/auth0-react';

const container = document.getElementById('root');
const root = createRoot(container); // Create a root.

// Replace these with your Auth0 domain and client ID
const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

root.render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    redirectUri={window.location.origin}
  >
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </Auth0Provider>
);
