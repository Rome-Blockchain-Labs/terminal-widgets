import { WalletProvider } from '@romeblockchain/wallet';
import { initializeApp } from 'firebase/app';
import { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { WidgetLoader } from './components/loaders/WidgetLoader';
import { FIREBASE_CHART_DATA_STORAGE, FIREBASE_WEB_API_KEY } from './config';
import { NetworkName } from './constants/networkExchange';
import { GtagContextProvider } from './contexts';
import reportWebVitals from './reportWebVitals';
import store from './store';
import GlobalStyles from './styles/GlobalStyles';

// const DmmWidget = lazy(() =>
//   import('./widgets/Dmm').then((module) => ({ default: module.DmmWidget }))
// );
// const VeloxWidget = lazy(() => import('./widgets/Velox'));

const UniswapV2Widget = lazy(() =>
  import('./widgets/UniswapV2').then((module) => ({
    default: module.UniswapV2Widget,
  }))
);

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

ReactDOM.render(
  <WalletProvider>
    <GtagContextProvider>
      <ReduxProvider store={store}>
        <Suspense
          fallback={
            <div style={{ display: 'grid', placeItems: 'center' }}>
              <WidgetLoader />
            </div>
          }
        >
          <Router>
            <GlobalStyles />

            <Switch>
              <Route path="/swap">
                <UniswapV2Widget
                  blockchain={NetworkName.AVALANCHE}
                  uid={'univ2'}
                />
              </Route>
              {/* <Route path="/kyber">
                <DmmWidget blockchain={NetworkName.ETHEREUM} uid={'kyber'} />
              </Route>

              <Route path="/velox">
                <VeloxWidget blockchain={NetworkName.ETHEREUM} uid={'velox'} />
              </Route> */}
            </Switch>
          </Router>
        </Suspense>
      </ReduxProvider>
    </GtagContextProvider>
  </WalletProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
