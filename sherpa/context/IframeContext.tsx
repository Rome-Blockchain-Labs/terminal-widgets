import { useRouter } from 'next/router'
import React, { useEffect, ReactNode, useRef, useState } from 'react'
import { RomeBridge } from '@rbl/terminal-library/RomeBridge'

enum MessageType {
  EVENT_ROME_WIDGET_CLOSE = 'EVENT_ROME_WIDGET_CLOSE',
  EVENT_ROME_WIDGET_ENLARGE = 'EVENT_ROME_WIDGET_ENLARGE',
  EVENT_ROME_CUSTOM_EVENT = 'EVENT_ROME_WIDGET_CUSTOM_EVENT',
}
interface Message {
  type: MessageType
  timestamp?: number
  broadcast?: boolean
  payload?: any
}

const IframeContext = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const [bridge, setBridge] = useState<any>()
  useEffect(() => {
    const loadBridge = async () => {
      const { romeBridge } = await import(
        '@rbl/terminal-library/RomeBridge/widget'
      )
      setBridge(romeBridge)
    }

    loadBridge()

    window.addEventListener('message', (ev) => {
      const homeRedirect = () => {
        router.push('/')
      }
      const complianceRedirect = () => {
        router.push('/compliance')
      }
      const event: Message = ev.data

      if (event.type === MessageType.EVENT_ROME_CUSTOM_EVENT) {
        if (event.payload.redirect === '/compliance') {
          complianceRedirect()
        }

        if (event.payload.redirect === '/') {
          homeRedirect()
        }
      }
    })
  }, [router])

  useEffect(() => {
    if (bridge) {
      bridge.subscribe('rome.terminal.click_button', function (payload: any) {
        console.log(payload)
      })
    }
  }, [bridge])

  return <>{children}</>
}

export default IframeContext
