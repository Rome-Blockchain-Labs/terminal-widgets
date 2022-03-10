import type { NextPage } from 'next'
import { useEffect } from 'react'
import useSherpaContext from '../hooks/useSherpaContext'
import HomePage from '../components/HomePage'

const Home: NextPage = () => {
  //home
  const { sherpaClient } = useSherpaContext()
  const client = sherpaClient as any

  useEffect(() => {
    const refreshSherpaClient = async () => {
      if (!client) return
      await client.fetchCircuitAndProvingKey() //must be done but can be done eagerly
    }
    refreshSherpaClient()
  }, [client])

  return <HomePage />
}

export default Home
