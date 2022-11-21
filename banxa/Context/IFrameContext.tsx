import React, { ReactNode, useEffect } from 'react'
import { widgetBridge } from '@romeblockchain/bridge'

export const IFrameContext = React.createContext({
  widgetBridge: null,
})

const IframeProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    widgetBridge.init()
    widgetBridge
  }, [])

  return <IFrameContext.Provider value={{ widgetBridge }}>{children}</IFrameContext.Provider>
}

export default IframeProvider
