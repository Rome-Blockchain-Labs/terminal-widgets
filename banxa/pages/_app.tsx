import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from 'components/Layout'
import AppProvider from 'context/AppProvider'
import { WalletProvider } from '@romeblockchain/wallet'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WalletProvider>
      <AppProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AppProvider>
    </WalletProvider>
  )
}

export default MyApp
