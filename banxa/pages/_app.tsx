import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from 'components/Layout'
import { WalletProvider } from '@romeblockchain/wallet'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient())
  const router = useRouter()
  const isLogin = !!getCookie('banxa')
  useEffect(() => {
    if (router.pathname === '/privacy-policy' || router.pathname === '/terms-of-use') {
      return
    }
    if (router.pathname !== '/forgot-password' && router.pathname !== '/reset-password' && !isLogin) {
      router.push('/')
    }
  }, [isLogin, router])

  return (
    <WalletProvider>
      <QueryClientProvider client={queryClient}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </WalletProvider>
  )
}

export default App
