import { Currency } from '@rbl/velox-common/uniV2ClonesSDK';

export function getDefaultCurrencySymbol(currency?: Currency | null) {
  /** Its a little tricky to get the native token symbol because
   * this function is called with the argument of
   * trade.outputAmount.currency and this is only configured with ETHER
   * as the native token. We could hack it together and pass the network into
   * this function, but it would be better to refactor the trade object throughout
   * ---
   * For now, saying native token instead of ETH/AVAX/BNB should suffice.
   * **/
  return currency?.symbol === 'ETH' && currency?.name === 'Ether'
    ? 'Native token'
    : currency?.symbol;
}
