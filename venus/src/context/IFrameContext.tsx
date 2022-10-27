import { RomeEventType, widgetBridge } from '@romeblockchain/bridge';
import React, { ReactNode, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

interface IFrameContextState {
  widgetBridge: typeof widgetBridge | null;
}

export const IFrameContext = React.createContext<IFrameContextState>({
  widgetBridge: null,
});

const IFrameProvider = ({ children }: { children: ReactNode }) => {
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    widgetBridge.emit(RomeEventType.WIDGET_GOOGLE_ANALYTICS_EVENT, 'Venus_Open');
  }, []);

  useEffect(() => {
    widgetBridge.init();
    widgetBridge.subscribe(
      RomeEventType.TERMINAL_CLICK_BUTTON,
      (action: any) => {
        switch (action.payload.id) {
          case 'dashboard':
            history.push('/dashboard');
            break;
          default:
            break;
        }
      },
    );
  }, [history]);

  useEffect(() => {
    const { pathname } = location;

    widgetBridge.emit(
      RomeEventType.TERMINAL_CLICK_BUTTON,
      pathname.replace('/', ''),
    );
  }, [location]);

  return (
    <IFrameContext.Provider value={{ widgetBridge }}>
      {children}
    </IFrameContext.Provider>
  );
};

export default IFrameProvider;
