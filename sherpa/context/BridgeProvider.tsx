import React, { createContext, ReactNode, useEffect } from 'react'
import { useState } from 'react'
import { BridgeSDK, Event } from '@rome/bridgesdk'
import { useRouter } from 'next/router'

interface Context {
  bus?: BridgeSDK
}

const defaultValue = {
  bus: undefined,
}
export const BridgeContext = createContext<Context>(defaultValue)

interface BridgeContextProps {
  children: ReactNode
}

const BridgeContextProvider = ({ children }: BridgeContextProps) => {
  const [bus, setBus] = useState<BridgeSDK>()
  const router = useRouter()

  useEffect(() => {
    const initialize = async () => {
      const bus = await BridgeSDK.init('sherpa')
      setBus(bus)
    }
    initialize()
  }, [])

  useEffect(() => {
    const redirectHandler = (request: Event) => {
      if (request.payload.redirect) {
        router.push(request.payload.redirect)
      }
    }
    if (bus) {
      bus.startListenStream({
        messageHandlers: [
          { event: { type: 'EVENT_SHERPA' }, handler: redirectHandler },
        ],
      })
    }
  }, [bus, router])

  const context = {
    bus,
  }
  return (
    <BridgeContext.Provider value={context}>{children}</BridgeContext.Provider>
  )
}

export default BridgeContextProvider
