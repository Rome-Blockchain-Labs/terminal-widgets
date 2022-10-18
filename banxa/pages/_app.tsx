import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from 'components/Layout'
import { WalletProvider } from '@romeblockchain/wallet'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { useState } from 'react'
import AuthContextProvider from 'Context/AuthContext'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <WalletProvider>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
          <ReactQueryDevtools initialIsOpen={false} />
        </AuthContextProvider>
      </QueryClientProvider>
    </WalletProvider>
  )
}

export default App
