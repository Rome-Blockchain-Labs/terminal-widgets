import React from 'react';
import ReactDOM from 'react-dom';
import { WalletProvider } from '@romeblockchain/wallet';

import App from 'pages/App';
// import * as serviceWorker from 'serviceWorker';

import 'antd/dist/antd.css';
import 'assets/styles/index.scss';

ReactDOM.render((
  <WalletProvider>
    <App />
  </WalletProvider>
), document.getElementById('root'));

// serviceWorker.register();
