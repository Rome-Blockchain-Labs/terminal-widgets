import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { WalletsContextProvider } from './WalletContext/WalletContext'

export default function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider)
  library.pollingInterval = 15000
  return library
}

if ('ethereum' in window) {
  window.ethereum.autoRefreshOnNetworkChange = false
}
const NetworkContextName = 'NETWORK'

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <WalletsContextProvider>
          <App />
        </WalletsContextProvider>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
    ,
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
