import { useResizeDetector } from 'react-resize-detector';

import {WalletSelectionContextProvider} from '../utils/web3/walletSelectionContext';
import { Widget, WidgetFrame } from './assets/styled';
import StrategyConfig from './components/StrategyConfig';
import WidgetSizeStateContext, {
  useWidgetSizeState,
  WidgetSizeState,
} from './WidgetSizeStateContext';

function App(props: WidgetSizeState) {
  const widgetSizeState = useWidgetSizeState();
  const { height, ref: widgetRef, width } = useResizeDetector<HTMLDivElement>();

  const component = (
    <Widget ref={widgetRef}>
      <WidgetFrame>
        <StrategyConfig />
      </WidgetFrame>
    </Widget>
  );

  widgetSizeState.enlargement = props.enlargement;
  widgetSizeState.width = width;
  widgetSizeState.height = height;

  return (
    <WidgetSizeStateContext.Provider value={widgetSizeState}>
      <WalletSelectionContextProvider>
        {component}
      </WalletSelectionContextProvider>

    </WidgetSizeStateContext.Provider>
  );
}

export default App;
