import React, { useState } from 'react';
import { FC, memo } from 'react';

import { isNativeWidget } from '../../constants/widget-mode-map';
import { WidgetCommonState, WidgetType } from '../../types';
import { WidgetSizeState } from '../WidgetSizeStateContext';
import VeloxApp from './App';
import { useEthereumInactiveListener } from './src/utils/web3';

export const widgetNameVelox = 'Velox';
export const enableNativeWidget = isNativeWidget(WidgetType.VELOX);

export const VeloxIframeWidget: FC<WidgetCommonState> = memo(() => {
  return <VeloxApp />;
});

export const VeloxNativeWidget: FC<WidgetCommonState> = memo(({ uid }) => {
  const [appId, setAppId] = useState(1);
  useEthereumInactiveListener(() => setAppId(appId + 1), null!);

  const widgetSizeState: WidgetSizeState = {
    enlarged: true,
  };

  return <VeloxApp key={uid + appId} {...widgetSizeState} />;
});

const VeloxWidget: FC<WidgetCommonState> = memo((props) => {
  return <VeloxNativeWidget {...props} />;
});
export default VeloxWidget;
