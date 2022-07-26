import { WalletProvider } from '@romeblockchain/wallet';
import { initializeApp } from 'firebase/app';
import ReactDOM from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { FIREBASE_CHART_DATA_STORAGE, FIREBASE_WEB_API_KEY } from './config';
import { NetworkName } from './constants/networkExchange';
import { GtagContextProvider } from './contexts';
import { WalletsContextProvider } from './contexts/WalletsContext/WalletContext';
import WalletModal from './contexts/WalletsContext/WalletModal';
// import { WalletBox } from './contexts/WalletsContext/WalletSelectionModal';
import reportWebVitals from './reportWebVitals';
import store from './store';
import GlobalStyles from './styles/GlobalStyles';
import { DmmWidget } from './widgets/Dmm';
import { UniswapV2Widget } from './widgets/UniswapV2';
import VeloxWidget from './widgets/Velox';

if ('ethereum' in window) {
  (window.ethereum as any).autoRefreshOnNetworkChange = false;
}

// disable zoom for mobiles (ios)
document.addEventListener('gesturestart', function (e) {
  e.preventDefault();
});

initializeApp({
  apiKey: FIREBASE_WEB_API_KEY,
  storageBucket: FIREBASE_CHART_DATA_STORAGE,
});

const mockUid =
  'src/components/modals/ModalWrapper.tsx-uses-this-for-modal-portal';

ReactDOM.render(
  <WalletProvider>
    <GtagContextProvider>
      <WalletsContextProvider>
        <ReduxProvider store={store}>
          <Router>
            <GlobalStyles />
            <WalletModal />

            <Switch>
              <Route path="/swap">
                <UniswapV2Widget
                  blockchain={NetworkName.AVALANCHE}
                  uid={mockUid + 'univ2'}
                />
              </Route>
              <Route path="/kyber">
                <DmmWidget blockchain={NetworkName.ETHEREUM} uid={'kyber'} />
              </Route>

              <Route path="/velox">
                <VeloxWidget
                  blockchain={NetworkName.ETHEREUM}
                  uid={mockUid + 'velox'}
                />
              </Route>
            </Switch>
          </Router>
        </ReduxProvider>
      </WalletsContextProvider>
    </GtagContextProvider>
  </WalletProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
