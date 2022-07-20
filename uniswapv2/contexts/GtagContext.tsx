import { stringify } from 'flatted'
import { createContext, FC, useContext } from 'react'
import TagManager from 'react-gtm-module'

const GA_CODE = process.env.REACT_APP_GA_CODE
type GtagContextState = {
  sendStatelessEvent: (
    event: string,
    widgetName: string,
    extraData?: object | string,
  ) => void
}

TagManager.initialize({ gtmId: GA_CODE ?? '' })
;(window as any).dataLayer = (window as any)?.dataLayer || []

export const GtagContext = createContext<GtagContextState>({
  sendStatelessEvent: (
    event: string,
    widgetName: string,
    extraData?: object | string,
  ) => {
    console.log(event, widgetName, extraData)
  },
})

export enum EventGroups {
  WalletConnection = 'Wallet_Connection',
  NetworkExchangeMenu = 'Network_Exchange_Menu',
  DashboardLayouting = 'Dashboard_Layouting',
  UserLists = 'User_List_Management',
  GeneralWidgets = 'General_Widgets_Actions',
  TransactionWidgets = 'Transactions_Widget_Actions',
  SocialMediaShare = 'Social_Media_Sharing',
  SearchBar = 'Search_Bar',
  TutorialOverlay = 'Tutorial_Overlay',
}

//this function is essentially stateless
export const sendStatelessEvent = async (
  event: string,
  widgetName: string,
  extraData?: object | string,
) => {
  ;(window as any)?.dataLayer.push({
    creation: 'developerEvent',
    event,
    extraData: stringify(extraData || {}),
    widgetName,
  })
}

export const GtagContextProvider: FC = ({ children }: any) => {
  return (
    <GtagContext.Provider value={{ sendStatelessEvent }}>
      {children}
    </GtagContext.Provider>
  )
}

export function useGtagContext() {
  const context = useContext(GtagContext)
  if (context === undefined) {
    throw new Error(
      'useGtagContext must be used within a useGtagContextProvider',
    )
  }
  return context
}
