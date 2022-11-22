import { RomeEventType, widgetBridge } from '@romeblockchain/bridge'
import React, { ReactNode, useEffect } from 'react'

interface IFrameContextState {
  widgetBridge: typeof widgetBridge | null
}

export const IFrameContext = React.createContext<IFrameContextState>({
  widgetBridge: null,
})

const IFrameProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    widgetBridge.emit(RomeEventType.WIDGET_GOOGLE_ANALYTICS_EVENT, 'Venus_Open')
  }, [])

  useEffect(() => {
    widgetBridge.init()
  }, [])

  return <IFrameContext.Provider value={{ widgetBridge }}>{children}</IFrameContext.Provider>
}

export default IFrameProvider
