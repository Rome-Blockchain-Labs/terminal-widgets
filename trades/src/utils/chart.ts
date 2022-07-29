import { getDownloadURL, getStorage, ref } from 'firebase/storage';

import { ChartData } from '../tvchart/charting_library';
import { ChartStructure, WidgetState } from '../types';

export const getChartId = (itemId: string, chartData: ChartData) =>
  `${itemId}__${chartData.name}`;

export const getChartStorageKey = (itemId: string) => `RT_CHART_${itemId}`;

export const getChartStateStorageKey = (itemId: string) =>
  `RT_CHART_STATE_${itemId}`;

export const getChartStorageData = (storageKey: string): ChartStructure => {
  try {
    const dataString = localStorage.getItem(storageKey);

    if (dataString) {
      return JSON.parse(dataString) as ChartStructure;
    }
  } catch {}
  return {};
};

export const clearChartStorage = (itemId: string) => {
  localStorage.removeItem(getChartStorageKey(itemId));
  localStorage.removeItem(getChartStateStorageKey(itemId));
};

export interface GetChartFromDB {
  widgetId: string;
}
export const getChartDataFromDB = (
  widgetId: string
): Promise<{ chartData: any; interval?: string; widget: WidgetState }> => {
  const storage = getStorage();
  return getDownloadURL(ref(storage, `${widgetId}.json`))
    .then((url) => fetch(url))
    .then((res) => res.json());
};
