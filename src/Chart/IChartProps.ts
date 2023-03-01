import { ChartNameIndex } from "./IFilteredChart";

export interface chartSeriesClick {
  chartIndex: ChartNameIndex;
  value: string;
  dateStart?: string;
  dateEnd?: string;
  x: number;
  y: number;
}

export interface IChartProps {
  data: any[];
  dataKey: string;
  dataValue: string[];
  area: string;
  title?: string;
  width?: any;
  height?: any;
  seriesClicked?(data: chartSeriesClick): void;
  seriesName: string;
  chartIndex: ChartNameIndex;
  // colors?:Record<string, string>[]; // amend to this if need colors keyed for values
  colors?: Array<string>;
  range?:{min:number, max:number};
}

export interface IUpdate {
  updateData?: (data?: any) => void;
}
