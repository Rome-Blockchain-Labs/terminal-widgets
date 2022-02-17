import React, {useEffect} from 'react';
// import { useWallets } from "@rbl/terminal-library/WalletContext/WalletContext.js"
import './App.css';
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector';
const injected = new InjectedConnector({});

function App() {
  // const x = useWallets()
  const { activate, active, chainId, deactivate, library } = useWeb3React()
  useEffect(() => {
    console.log(injected.isAuthorized().then(console.log))
    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        activate(injected);
        // next line is a for for: https://giters.com/NoahZinsmeister/web3-react/issues/257
        //@ts-ignore
        window?.ethereum?.removeAllListeners(['networkChanged']);
      }else{
        activate(injected, undefined, true).catch(() => {
        });
      }
    });
  }, [activate]);

  console.log(library)
  return (
    <div className="App">
      <header className="App-header">

          Learn React
      </header>
    </div>
  );
}

export default App;
