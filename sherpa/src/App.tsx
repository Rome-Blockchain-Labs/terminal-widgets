import Home from 'pages/Home'
import { Routes, Route, Link } from 'react-router-dom'
import UniqueKey from './pages/UniqueKey'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/unique" element={<UniqueKey />} />
    </Routes>
  )
}

export default App
