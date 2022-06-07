import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";
import globaux from './globals';

const client = new ApolloClient({uri: globaux.server, cache: new InMemoryCache()});

ReactDOM.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <App/>
        </ApolloProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

