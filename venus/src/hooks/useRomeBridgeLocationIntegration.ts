import { RomeEventType, widgetBridge } from '@romeblockchain/bridge';
import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

const useRomeBridgeLocationIntegration = () => {
  const history = useHistory();
  const location = useLocation();

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
};

export default useRomeBridgeLocationIntegration;
