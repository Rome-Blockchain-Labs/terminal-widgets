import { FC } from 'react';

import { WidgetCommonState, WidgetState, WidgetType } from '../types';

export const WIDGET_MAP: {
  [key in WidgetType]?: FC<WidgetCommonState> | FC<WidgetState>;
} = {};
