import { useReducer } from 'react'

export interface Currency {
  code: string
  name: string
}

interface SelectReducerState {
  currencyList?: Currency[]
  setCurrency?: (val: string) => void
  selectedCurrency?: string
  visible: boolean
  selectCurrencyType: string
}
const useSelectReducer = (
  tokenBuyList: Currency[],
  tokenSellList: Currency[],
  fiatBuyList: Currency[],
  fiatSellList: Currency[],
  setTarget: (val: string) => void,
  target: string | undefined,
  setSource: (val: string) => void,
  source: string | undefined
) => {
  const initialState: SelectReducerState = {
    currencyList: undefined,
    setCurrency: undefined,
    selectedCurrency: undefined,
    visible: false,
    selectCurrencyType: 'FIAT',
  }

  const reducer = (state: SelectReducerState, action: any) => {
    switch (action.type) {
      case 'CLOSE_SELECT':
        return {
          ...initialState,
        }
      case 'OPEN_BUY_LIST':
        if (action.selectCurrencyType === 'CRYPTO') {
          return {
            currencyList: tokenBuyList,
            setCurrency: setTarget,
            selectedCurrency: target,
            visible: true,
            selectCurrencyType: 'CRYPTO',
          }
        }
        if (action.selectCurrencyType === 'FIAT') {
          return {
            currencyList: fiatBuyList,
            setCurrency: setSource,
            selectedCurrency: source,
            selectCurrencyType: 'FIAT',
            visible: true,
          }
        }
      case 'OPEN_SELL_LIST':
        if (action.selectCurrencyType === 'CRYPTO') {
          return {
            currencyList: tokenSellList,
            setCurrency: setSource,
            selectedCurrency: source,
            selectCurrencyType: 'CRYPTO',
            visible: true,
          }
        }
        if (action.selectCurrencyType === 'FIAT') {
          return {
            currencyList: fiatSellList,
            setCurrency: setTarget,
            selectedCurrency: target,
            selectCurrencyType: 'FIAT',
            visible: true,
          }
        }
      default:
        return state
    }
  }

  return useReducer(reducer, initialState)
}

export default useSelectReducer
