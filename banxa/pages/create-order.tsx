import type { NextPage } from 'next'
import CreateOrder from 'components/CreateOrder'

// as much as possible, add all params for creating a buy or sell order
// https://docs.banxa.com/reference/create-order
// walllet address needs to be verified for each network  BTC, ETH, BNB,
// BNB transactions would require the user to include a MEMO/TAG input

const Home: NextPage = () => {
  return <CreateOrder />
}

export default Home
