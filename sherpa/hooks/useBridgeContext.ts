import { useContext } from 'react'
import { BridgeContext } from '../context/BridgeProvider'

const useBridgeContext = () => {
  return useContext(BridgeContext)
}

export default useBridgeContext
