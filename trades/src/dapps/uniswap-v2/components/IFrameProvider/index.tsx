import { RomeEventType, widgetBridge } from '@romeblockchain/bridge';
import React, { ReactNode, useContext, useEffect } from 'react';

import { UniswapPage } from '../../App';
import { usePageContext } from '../../PageContext';
import { useSettingsModalToggle } from '../../state/application/hooks';

interface IFrameContextState {
  widgetBridge: typeof widgetBridge | null;
}

export const IFrameContext = React.createContext<IFrameContextState>({
  widgetBridge: null,
});

const IFrameProvider = ({ children }: { children: ReactNode }) => {
  const { setPage } = usePageContext();
  const toggle = useSettingsModalToggle();
  useEffect(() => {
    widgetBridge.init();

    widgetBridge.subscribe(
      RomeEventType.TERMINAL_CLICK_BUTTON,
      function (action: any) {
        switch (action.payload.id) {
          case 'swap':
            setPage(UniswapPage.SWAP);
            break;
          case 'pool':
            setPage(UniswapPage.POOL);
            break;
          case 'setting':
            toggle();
            break;
          default:
            break;
        }
      }
    );
  }, [setPage, toggle]);

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
