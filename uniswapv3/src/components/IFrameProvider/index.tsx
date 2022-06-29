import { RomeEventType, widgetBridge } from '@romeblockchain/bridge'
import React, { ReactNode, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

interface IFrameContextState {
  widgetBridge: typeof widgetBridge | null
}

export const IFrameContext = React.createContext<IFrameContextState>({
  widgetBridge: null,
})

const IFrameProvider = ({ children }: { children: ReactNode }) => {
  const history = useHistory()
  useEffect(() => {
    widgetBridge.init()
    widgetBridge.subscribe(RomeEventType.TERMINAL_CLICK_BUTTON, function (action: any) {
      switch (action.payload.id) {
        case 'swap':
          history.push('/swap')
          break
        case 'pool':
          history.push('/pool')
          break
        default:
          break
      }
    })
  }, [history])

  return <IFrameContext.Provider value={{ widgetBridge }}>{children}</IFrameContext.Provider>
}

export default IFrameProvider
