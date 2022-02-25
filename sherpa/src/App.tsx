import Compliance from 'pages/Compliance'
import ConnectWallet from 'pages/ConnectWallet'
import Home from 'pages/Home'
import { Routes, Route, Link } from 'react-router-dom'
import UniqueKey from './pages/UniqueKey'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/unique" element={<UniqueKey />} />
      <Route path="/compliance" element={<Compliance />} />

      <Route path="/connect-wallet" element={<ConnectWallet />} />
    </Routes>
  )
}

export default App
