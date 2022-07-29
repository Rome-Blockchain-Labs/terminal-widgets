import React, { useState } from 'react';

import { useEthereumInactiveListener } from '../utils/web3';
import { ToolbarStrategyList } from './components/ToolbarStrategyList';
import { WalletConnector } from './components/WalletConnector';
import VeloxWidget from './index';
import { WidgetSizeState } from './WidgetSizeStateContext';

function VeloxTestWidget(props: WidgetSizeState) {
  const [appId, setAppId] = useState(1);

  useEthereumInactiveListener(() => setAppId(appId + 1), null);

  const widgetEnlargementClassName = 'widget-enlargement-1'; // widget-enlargement-0: none, widget-enlargement-1: enlarged, widget-enlargement-2: fullscreen

  return (
    <div className={widgetEnlargementClassName}>
      <div>
        <WalletConnector />
        <span>&nbsp;|&nbsp;</span>
        <ToolbarStrategyList />
      </div>
      <VeloxWidget key={'app' + appId} {...props} />
    </div>
  );
}

export default VeloxTestWidget;
