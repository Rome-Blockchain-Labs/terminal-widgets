import { RomeEventType, widgetBridge } from '@romeblockchain/bridge'
import React, { ReactNode, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import { useToggleSettingsMenu } from '../../state/application/hooks'

interface IFrameContextState {
  widgetBridge: typeof widgetBridge | null
}

export const IFrameContext = React.createContext<IFrameContextState>({
  widgetBridge: null,
})

const IFrameProvider = ({ children }: { children: ReactNode }) => {
  const history = useHistory()
  const toggle = useToggleSettingsMenu()
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
        case 'setting':
          toggle()
          break
        default:
          break
      }
    })
  }, [history, toggle])

  return <IFrameContext.Provider value={{ widgetBridge }}>{children}</IFrameContext.Provider>
}

export default IFrameProvider
