import { RomeEventType, widgetBridge } from '@romeblockchain/bridge';
import { NetworkName, useWeb3React } from '@romeblockchain/wallet';
import React, { ReactNode, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';

interface IFrameContextState {
  widgetBridge: typeof widgetBridge | null;
}

export const IFrameContext = React.createContext<IFrameContextState>({
  widgetBridge: null,
});

// Do not extend provider with other variables to prevent rerenders
const IFrameProvider = ({ children }: { children: ReactNode }) => {
  const { chainId } = useWeb3React();

  useEffect(() => {
    widgetBridge.init();
  }, []);

  useEffect(() => {
    const getNetwork = () => {
      switch (chainId) {
        case 1:
          return NetworkName.ETHEREUM;
        case 43114:
          return NetworkName.AVALANCHE;
        case 56:
          return NetworkName.BINANCE;
        default:
          break;
      }
    };

    if (chainId) {
      const currentNetwork = getNetwork();
      widgetBridge.emit(RomeEventType.WIDGET_GENERIC_MESSAGE, {
        blockchain: currentNetwork,
      });
    }
  }, [chainId]);

  return (
    <IFrameContext.Provider value={{ widgetBridge }}>
      {children}
    </IFrameContext.Provider>
  );
};

export default IFrameProvider;

export const useIFrameContext = () => {
  const context = useContext(IFrameContext);
  if (context === undefined) {
    throw new Error(
      'useIFrameContext must be used within a IFrameContextProvider'
    );
  }
  return context;
};
