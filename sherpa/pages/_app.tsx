import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Web3 from 'web3'
import { Web3ReactProvider } from '@web3-react/core'
import { useEffect } from 'react'
import SherpaContextProvider from '../context/SherpaContext'
import Script from 'next/script'
import BridgeContextProvider from '../context/BridgeProvider'

function getLibrary(provider: any) {
  const library = new Web3(provider)
  return library
}

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.autoRefreshOnNetworkChange = false
    }
  }, [])

  return (
    <>
      <Script
        strategy="beforeInteractive"
        src="https://cdn.jsdelivr.net/npm/rxjs@6.6.3/bundles/rxjs.umd.min.js"
      ></Script>
      <BridgeContextProvider>
        <Web3ReactProvider getLibrary={getLibrary}>
          <SherpaContextProvider>
            <Component {...pageProps} />
          </SherpaContextProvider>
        </Web3ReactProvider>
      </BridgeContextProvider>
    </>
  )
}

export default MyApp
