import { widgetBridge } from '@romeblockchain/bridge';
import React, { ReactNode, useContext, useEffect } from 'react';

interface IFrameContextState {
  widgetBridge: typeof widgetBridge | null;
}

export const IFrameContext = React.createContext<IFrameContextState>({
  widgetBridge: null,
});

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
