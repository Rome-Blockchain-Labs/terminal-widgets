import { ChartData } from '../tvchart/charting_library';

export type ChartStructure = {
  [chartId: string]: {
    chartData: ChartData;
    timestamp: number;
  };
};
