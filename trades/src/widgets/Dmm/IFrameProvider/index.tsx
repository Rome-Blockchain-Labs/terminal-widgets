import { widgetBridge } from '@romeblockchain/bridge';
import React, { ReactNode, useContext, useEffect } from 'react';

interface IFrameContextState {
  widgetBridge: typeof widgetBridge | undefined;
}

export const IFrameContext = React.createContext<IFrameContextState>({
  widgetBridge: undefined,
});

// Do not extend provider with other variables to prevent rerenders
const IFrameProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    widgetBridge.init();
  }, []);

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
