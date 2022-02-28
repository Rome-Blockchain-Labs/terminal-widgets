import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import GlobalStyles from './styles/GlobalStyles'
import Web3 from 'web3'
import { BrowserRouter } from 'react-router-dom'
import SherpaContextProvider from 'context/SherpaContext'

// export default function getLibrary(provider: any): Web3Provider {
//   const library = new Web3Provider(provider)
//   library.pollingInterval = 15000
//   return library
// }

export default function getLibrary(provider: any) {
  const library = new Web3(provider)
  // library.pollingInterval = 15000
  return library
}

if ('ethereum' in window) {
  window.ethereum.autoRefreshOnNetworkChange = false
}

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <SherpaContextProvider>
        <GlobalStyles />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SherpaContextProvider>
    </Web3ReactProvider>
    ,
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
