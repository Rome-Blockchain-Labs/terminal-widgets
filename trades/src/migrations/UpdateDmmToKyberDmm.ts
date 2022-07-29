const updateWidgets = (storage: any) => {
  if (!storage.widgets) return;

  const items = storage.widgets.map((item: any) => {
    if (item.exchangeType === 'dmm') {
      return {
        ...item,
        exchangeType: 'kyberdmm',
      };
    }
    return item;
  });
  return items;
};

export const UpdateDmmToKyberDmm = (storage: any): any => {
  const widgets = updateWidgets(storage);

  return {
    ...storage,
    widgets: widgets,
  };
};

export default UpdateDmmToKyberDmm;
