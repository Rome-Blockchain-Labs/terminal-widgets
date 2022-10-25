import { ExchangeType, NetworkName } from '../constants/networkExchange';

export const ReplaceNetworkExchangeEnumsForStrings = (storage: any): any => {
  /** Blockchain **/
  storage.widgets = storage?.widgets?.map((widget: any) => {
    if (Number.isInteger(Number(widget.blockchain))) {
      switch (Number(widget.blockchain)) {
        case 0:
          widget.blockchain = NetworkName.AVALANCHE;
          break;
        case 2:
          widget.blockchain = NetworkName.ETHEREUM;
          break;
        case 4:
          widget.blockchain = NetworkName.BINANCE;
          break;
        case 14:
          widget.blockchain = NetworkName.MOONBEAM;
          break;
        case 15:
          widget.blockchain = NetworkName.MOONRIVER;
          break;
      }
    }
    return widget;
  });
  /** Exchange **/
  storage.widgets = storage?.widgets?.map((widget: any) => {
    if (Number.isInteger(Number(widget.exchangeType))) {
      switch (Number(widget.exchangeType)) {
        case 0:
          widget.exchangeType = ExchangeType.PANGOLIN;
          break;
        case 2:
          widget.exchangeType = ExchangeType.TRADERJOE;
          break;
        case 3:
          widget.exchangeType = ExchangeType.PANCAKESWAP;
          break;
        case 4:
          widget.exchangeType = ExchangeType.MDEX;
          break;
        case 5:
          widget.exchangeType = ExchangeType.SAFESWAP;
          break;
        case 8:
          widget.exchangeType = ExchangeType.BEAMSWAP;
          break;
        case 9:
          widget.exchangeType = ExchangeType.SOLARBEAM;
          break;
      }
    }
    return widget;
  });
  return JSON.parse(JSON.stringify(storage));
};

export default ReplaceNetworkExchangeEnumsForStrings;
