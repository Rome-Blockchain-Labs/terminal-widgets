import { useReducer } from 'react'

interface SelectReducerState {
  currencyList?: any[]
  setCurrency?: (val: string) => void
  selectedCurrency?: string
  visible: boolean
  selectCurrencyType: string
}
const useSelectReducer = (
  tokenBuyList: any,
  tokenSellList: any,
  fiatBuyList: any,
  fiatSellList: any,
  setTarget: any,
  target: any,
  setSource: any,
  source: any
) => {
  console.log(source)
  console.log(target)
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
