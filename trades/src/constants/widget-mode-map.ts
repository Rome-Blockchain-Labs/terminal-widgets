import { getCurrentEnvDataFrom } from '../config';
import { AppEnv, WidgetMode, WidgetType } from '../types';

/**
 * If you want the app an an iframe in production, and in staging a native app,
 * set PROD_WIDGET_MODE_MAP[WIDGET]:WidgetMode.IFRAME and
 * set STAGING_WIDGET_MODE_MAP[WIDGET]:WidgetMode.NATIVE
 * ---
 * Staging values will over-ride prod if you are in the staging environment
 * **/
export const PROD_WIDGET_MODE_MAP: {
  [key in WidgetType]: WidgetMode;
} = {
  [WidgetType.TRANSACTIONS]: WidgetMode.NATIVE,
  [WidgetType.PANGOLIN]: WidgetMode.NATIVE,
  [WidgetType.TRADERJOE]: WidgetMode.NATIVE,
  [WidgetType.PANCAKESWAP]: WidgetMode.NATIVE,
  [WidgetType.BEAMSWAP]: WidgetMode.NATIVE,
  [WidgetType.SOLARBEAM]: WidgetMode.NATIVE,
  [WidgetType.NETSWAP]: WidgetMode.NATIVE,
  [WidgetType.SUSHISWAP]: WidgetMode.NATIVE,
  [WidgetType.UNISWAPV2]: WidgetMode.NATIVE,
  [WidgetType.CHARTONLY]: WidgetMode.NATIVE,
  [WidgetType.CRYSTALVALE]: WidgetMode.NATIVE,
  [WidgetType.VELOX]: WidgetMode.NATIVE,
  [WidgetType.MDEX]: WidgetMode.NATIVE,
};

export const STAGING_WIDGET_MODE_MAP = {};

export const TEST_WIDGET_MODE_MAP = {};

export const WIDGET_MODE_MAP = getCurrentEnvDataFrom({
  [AppEnv.PRODUCTION]: PROD_WIDGET_MODE_MAP,
  [AppEnv.STAGING]: { ...PROD_WIDGET_MODE_MAP, ...STAGING_WIDGET_MODE_MAP },
  [AppEnv.TEST]: { ...PROD_WIDGET_MODE_MAP, ...TEST_WIDGET_MODE_MAP },
});

export const isNativeWidget = (widgetType: WidgetType): boolean => {
  if (WIDGET_MODE_MAP) {
    return WIDGET_MODE_MAP[widgetType] === WidgetMode.NATIVE;
  }

  return false;
};

export const isIframeWidget = (widgetType: WidgetType) => {
  if (WIDGET_MODE_MAP) {
    return WIDGET_MODE_MAP[widgetType] === WidgetMode.IFRAME;
  }

  return false;
};
