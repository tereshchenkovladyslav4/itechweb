import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Brush } from 'recharts';
import Colors from "./colors";
import LoadingSpinner from "../../_components/LoadingSpinner";
import ChartContainer from "./ChartContainer";

interface ILineChartProps {
  data: any[];
  dataKey: string;
  dataValue: string[];
  title?: string;
}

const LineComponent: React.FC<ILineChartProps> = ({ data, dataKey, dataValue, title }: ILineChartProps) => {

  const [barProps, setBarProps] = useState(
    dataValue.reduce(
      (a: any) => {
        a[a] = false;
        return a;
      },
      { hover: null }
    )
  );

  const selectBar = (e: any) => {
    setBarProps((prev: any) => {
      return {
        ...prev,
        [e.dataKey]: !prev[e.dataKey],
        hover: null
      }
    });
  };

  return (
    <ChartContainer title={title}>
      {data && data.length ?
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={dataKey} />
          <YAxis />
          <Tooltip isAnimationActive={false} />
          <Legend onClick={selectBar} wrapperStyle={{ lineHeight: '16px' }} />
          <Brush dataKey={dataKey} height={30} stroke="#8884d8" />   {/* can set a small start winodw with something like: startIndex={data.length > 200 ? data.length - 100 : 0} */}
          {dataValue && dataValue.map((x: any, index: number) =>
            <Line key={`line-${index}`} type="monotone" dataKey={x} stroke={Colors[index % Colors.length]} hide={barProps[x] === true} animationDuration={2000} />
          )}
        </LineChart>
         :
        <LoadingSpinner />
      } 
    </ChartContainer>
  );
}
export default LineComponent;
