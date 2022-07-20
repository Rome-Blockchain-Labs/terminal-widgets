import { values } from 'lodash';

import { AppState } from '..';

export const widgetByIdSelector = (state: AppState) => (uid: string) => {
  return state.app.widgets.filter((widget) => widget.uid === uid)[0];
};

export const widgetIndexByIdSelector = (state: AppState) => (uid: string) => {
  return state.app.widgets.findIndex((widget) => widget.uid === uid);
};

export const watchWidgetListSelector = (state: AppState) => {
  return values(state.app.watchingWidgets);
};

export const widgetsSelector = (state: AppState) => {
  return values(state.app.widgets);
};

export const numWidgetsSelector = (state: AppState) => {
  return state.app.widgets.length;
};
