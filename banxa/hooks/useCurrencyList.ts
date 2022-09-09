import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const useCurrencyLists = () => {
  const { data: fiatBuyList, error: fiatBuyListError } = useQuery(['fiatBuyData'], async () => {
    const res = await axios.get('/api/banxa/fiat-buy')

    return res.data.data.fiats.map((fiat: any) => ({
      code: fiat.fiat_code,
      name: fiat.fiat_name,
    }))
  })
  const { data: tokenBuyList, error: tokenBuyListError } = useQuery(['tokenBuyData'], async () => {
    const tokenBuyRes = await axios.get('api/banxa/crypto-buy')
    return tokenBuyRes.data.data.coins
      .filter((coin: any) => coin.coin_code !== 'BTC')
      .map((coin: any) => ({
        code: coin.coin_code,
        name: coin.coin_name,
      }))
  })

  const { data: fiatSellList, error: fiatSellListError } = useQuery(['fiatSellData'], async () => {
    const res = await axios.get('/api/banxa/fiat-sell')

    return res.data.data.fiats.map((fiat: any) => ({
      code: fiat.fiat_code,
      name: fiat.fiat_name,
    }))
  })
  const { data: tokenSellList, error: tokenSellListError } = useQuery(['tokenSellData'], async () => {
    const tokenBuyRes = await axios.get('api/banxa/crypto-sell')
    return tokenBuyRes.data.data.coins
      .filter((coin: any) => coin.coin_code !== 'BTC')
      .map((coin: any) => ({
        code: coin.coin_code,
        name: coin.coin_name,
      }))
  })
  return {
    fiatBuyList,
    fiatBuyListError,
    tokenBuyList,
    tokenBuyListError,
    fiatSellList,
    fiatSellListError,
    tokenSellList,
    tokenSellListError,
  }
}
export default useCurrencyLists
