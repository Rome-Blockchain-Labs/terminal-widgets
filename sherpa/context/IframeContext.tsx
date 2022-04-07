import { useRouter } from 'next/router'
import React, { useEffect, ReactNode } from 'react'
import { widgetBridge, RomeEventType } from '@romeblockchain/terminal-library/romeBridge'

const IframeContext = ({ children }: { children: ReactNode }) => {
  const router = useRouter()

  useEffect(() => {
    widgetBridge.init()
    widgetBridge.subscribe(
      RomeEventType.TERMINAL_CLICK_BUTTON,
      function (action: any) {
        const homeRedirect = () => {
          router.push('/')
        }
        const complianceRedirect = () => {
          router.push('/compliance')
        }
        if (action.payload.id === 'home') {
          homeRedirect()
        }
        if (action.payload.id === 'compliance') {
          complianceRedirect()
        }
      }
    )
  }, [router])

  return <>{children}</>
}

export default IframeContext
