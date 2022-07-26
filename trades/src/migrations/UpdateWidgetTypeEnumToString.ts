import { WidgetType } from '../types';

enum OldWidgetType {
  TRANSACTIONS,
  PANGOLIN,
  VELOX,
  TRADERJOE,
  KYBERSWAP,
  ELLIPSIS,
  MDEX,
  PANCAKESWAP,
  QUICKSWAP,
  RAYDIUM,
  SABER,
  SAFESWAP,
  SUSHISWAP,
  UNISWAP,
  AVAX_BRIDGE,
  KUU,
  BENQI,
  CREAM,
  BISWAP,
  SHERPACASH,
}

const isOldWidgetType = (value: number) => {
  if (Object.values(OldWidgetType).indexOf(value) > -1) {
    return true;
  }

  return false;
};

const convertWidgetType = (type: any) => {
  if (isOldWidgetType(type)) {
    return WidgetType[OldWidgetType[type as number] as keyof typeof WidgetType];
  }

  return type;
};

const updateWidgets = (storage: any) => {
  if (!storage.widgets) return;

  const items = storage.widgets.map((item: any) => {
    const widgetType = convertWidgetType(item.type);
    return { ...item, type: widgetType };
  });

  return items;
};

const updateWatchingWidgets = (storage: any) => {
  if (!storage.watchingWidgets) return;

  const watchingWidgets = { ...storage.watchingWidgets };

  Object.keys(storage.watchingWidgets).forEach((key: string) => {
    const item = storage.watchingWidgets[key];
    const widgetType = convertWidgetType(item.widget.type);

    watchingWidgets[key].widget.type = widgetType;
  });

  return watchingWidgets;
};

export const UpdateWidgetTypeEnumToString = (storage: any): any => {
  const widgets = updateWidgets(storage);
  const watchingWidgets = updateWatchingWidgets(storage);

  return {
    ...storage,
    watchingWidgets: watchingWidgets,
    widgets: widgets,
  };
};

export default UpdateWidgetTypeEnumToString;
