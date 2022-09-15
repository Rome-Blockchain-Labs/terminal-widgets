import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from 'components/Layout'
import { WalletProvider } from '@romeblockchain/wallet'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient())
  const router = useRouter()
  const isLogin = !!getCookie('banxa')
  useEffect(() => {
    if (!isLogin) {
      router.push('/')
    }
  }, [isLogin, router])

  return (
    <WalletProvider>
      <QueryClientProvider client={queryClient}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </QueryClientProvider>
    </WalletProvider>
  )
}

export default App
