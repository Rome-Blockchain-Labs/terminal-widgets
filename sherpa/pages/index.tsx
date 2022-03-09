import type { NextPage } from 'next'
import { useCallback, useEffect, useState } from 'react'
import useSherpaContext from '../hooks/useSherpaContext'
import saveAs from 'file-saver'
import HomePage from '../components/HomePage'

const Home: NextPage = () => {
  const { AVAXContracts, sherpaClient } = useSherpaContext()
  const client = sherpaClient as any
  const [selectedContract, setSelectedContract] = useState(AVAXContracts[0])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchEvents = async () => {
      if (!client) return
      setLoading(true)
      const weiToEther = (x: any) => x * 1e18
      const res = await client.fetchEvents(
        weiToEther(selectedContract.val),
        'avax'
      )
      // const eventList = res.events.slice(0, 12)
      // setTotalDeps(res.events.length)
      // setEvents(eventList)
      setLoading(false)
    }
    fetchEvents()
  }, [AVAXContracts, client, selectedContract])

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
