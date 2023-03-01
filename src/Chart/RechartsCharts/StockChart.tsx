import React from "react";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  ErrorBar,
  ComposedChart,
  Line,
  Cell,
  ResponsiveContainer,
} from "recharts";

interface StockDailyDataPoint {
  // TODO: should be date instead of number
  date: number;
  high: number;
  low: number;
  open: number;
  close: number;
}

interface CandleStickDataPoint {
  //TODO: should be date instead of number
  date: number;
  low: number;
  high: number;
  errorLowUp: number | null;
  errorHighUp: number | null;
  errorLowDown: number | null;
  errorHighDown: number | null;
  height: number;
  errorLineHigh: number;
  errorLineLow: number;
  up: boolean;
}

const testData = [
  { date: 11, high: 5, low: 2, open: 4, close: 5 },
  { date: 12, high: 6, low: 3, open: 5, close: 6 },
  { date: 13, high: 8, low: 6, open: 6, close: 7 },
  { date: 14, high: 6, low: 2, open: 6, close: 4 },
  { date: 15, high: 5, low: 1, open: 3, close: 2 },
  { date: 16, high: 4, low: 1, open: 4, close: 2 },
  { date: 17, high: 3, low: 1, open: 4, close: 2 },
  { date: 18, high: 5, low: 1, open: 4, close: 2 },
  { date: 19, high: 5, low: 1, open: 4, close: 2 },
  { date: 20, high: 5, low: 1, open: 4, close: 2 },
  { date: 21, high: 5, low: 1, open: 4, close: 2 },
  { date: 22, high: 5, low: 1, open: 4, close: 2 },
  { date: 23, high: 5, low: 1, open: 4, close: 2 },
];

// data: Array<StockDailyDataPoint>
interface CandleStickProps {
  data?: Array<StockDailyDataPoint>;
  colorUp?: string;
  colorDown?: string;
  barWidth?: number;
  lineWidth?: number;
  width?: number;
  height?: number;
}

// {date: 11, high:5, low: 1, open: 4, close: 2}
const CandleStick = ({
  colorUp = "#00906F",
  colorDown = "#B23507",
  barWidth = 10,
  lineWidth = 3,
  ...props
}: CandleStickProps) => {
  props.data = testData;
  props.width = 500;
  props.height = 300;

  const data = props.data.map(
    (point: StockDailyDataPoint): CandleStickDataPoint => {
      return {
        date: point.date,
        low: Math.min(point.close, point.open),
        high: Math.max(point.close, point.open),
        height: Math.abs(point.close - point.open),
        errorLineHigh:
          (point.high - Math.max(point.close, point.open)) / 2 +
          Math.max(point.close, point.open),
        errorLineLow:
          Math.min(point.close, point.open) -
          (Math.min(point.close, point.open) - point.low) / 2,
        errorLowUp:
          point.close > point.open
            ? (Math.min(point.close, point.open) - point.low) / 2
            : null,
        errorHighUp:
          point.close > point.open
            ? (point.high - Math.max(point.close, point.open)) / 2
            : null,
        errorLowDown:
          point.close <= point.open
            ? (Math.min(point.close, point.open) - point.low) / 2
            : null,
        errorHighDown:
          point.close <= point.open
            ? (point.high - Math.max(point.close, point.open)) / 2
            : null,
        up: point.close > point.open,
      };
    }
  );

  const maxHeight: number = data.reduce(
    (max, point) =>
      Math.max(
        point.high +
          (point.errorHighUp ? point.errorHighUp : 0) +
          (point.errorHighDown ? point.errorHighDown : 0),
        max
      ),
    0
  );
  const minHeight: number = data.reduce(
    (min, point) =>
      Math.min(
        point.low -
          (point.errorLowDown ? point.errorLowDown : 0) -
          (point.errorLowDown ? point.errorLowDown : 0),
        min
      ),
    0
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart width={props.width} height={props.height} data={data}>
        <CartesianGrid horizontal={false} strokeDasharray={"1 1"} />
        <XAxis dataKey="date" />
        <YAxis domain={[minHeight - 2, maxHeight + 2]} />

        {/*Floating bar*/}
        <Bar dataKey="low" fillOpacity={0} stackId={"stack"} />
        <Bar dataKey="height" stackId={"stack"} barSize={barWidth}>
          {data.map((entry) => (
            <Cell key={entry.date} fill={entry.up ? colorUp : colorDown} />
          ))}
        </Bar>

        {/*Error down*/}
        <Line
          dataKey={"errorLineHigh"}
          stroke={"none"}
          isAnimationActive={false}
          dot={false}
        >
          <ErrorBar
            dataKey={"errorHighDown"}
            width={lineWidth}
            strokeWidth={lineWidth - 1}
            stroke={colorDown}
          />
        </Line>

        <Line
          dataKey={"errorLineLow"}
          stroke={"none"}
          isAnimationActive={false}
          dot={false}
        >
          <ErrorBar
            dataKey={"errorLowDown"}
            width={lineWidth}
            strokeWidth={lineWidth - 1}
            stroke={colorDown}
          />
        </Line>

        {/*Error up */}
        <Line
          dataKey={"errorLineHigh"}
          stroke={"none"}
          isAnimationActive={false}
          dot={false}
        >
          <ErrorBar
            dataKey={"errorHighUp"}
            width={lineWidth}
            strokeWidth={lineWidth - 1}
            stroke={colorUp}
          />
        </Line>

        <Line
          dataKey={"errorLineLow"}
          stroke={"none"}
          isAnimationActive={false}
          dot={false}
        >
          <ErrorBar
            dataKey={"errorLowUp"}
            width={lineWidth}
            strokeWidth={lineWidth - 1}
            stroke={colorUp}
          />
        </Line>
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default CandleStick;
