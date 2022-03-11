import React, { createContext, ReactNode, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useState } from 'react'
import { injected } from '../connectors'
import * as sherpa from 'ian-sherpasdk-beta'
import { useTestnet } from '../config'

const netId = useTestnet ? 43113 : 43114
const AVAXContracts = [{ val: 10 }, { val: 100 }, { val: 500 }]

const defaultValue = {
  sherpaClient: null,
  sherpaRelayerOptions: [],
  AVAXContracts,
}
export const SherpaContext = createContext(defaultValue)

interface SherpaContextProps {
  children: ReactNode
}

const SherpaContextProvider = ({ children }: SherpaContextProps) => {
  const { library, active, activate } = useWeb3React()
  const [sherpaClient, setSherpaClient] = useState<any>(null)
  const [sherpaRelayerOptions, setSherpaRelayerOptions] = useState<any>([])

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized || window.ethereum) {
        activate(injected)
        // next line is a for for: https://giters.com/NoahZinsmeister/web3-react/issues/257
        window?.ethereum?.removeAllListeners(['networkChanged'])
      }
    })
  }, [activate])

  useEffect(() => {
    if (active) {
      const client = new sherpa.SherpaSDK(netId, library)
      setSherpaRelayerOptions(client.getRelayerList())
      setSherpaClient(client)
    }
  }, [active, library])

  const context = {
    sherpaClient,
    sherpaRelayerOptions,
    AVAXContracts,
  }
  return (
    <SherpaContext.Provider value={context}>{children}</SherpaContext.Provider>
  )
}

export default SherpaContextProvider
