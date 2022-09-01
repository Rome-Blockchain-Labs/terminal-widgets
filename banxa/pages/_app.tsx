import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from 'components/Layout'
import AppProvider from 'context/AppProvider'
import { WalletProvider } from '@romeblockchain/wallet'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = React.useState(() => new QueryClient())

  return (
    <WalletProvider>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AppProvider>
      </QueryClientProvider>
    </WalletProvider>
  )
}

export default MyApp
