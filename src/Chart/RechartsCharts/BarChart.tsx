import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Brush } from 'recharts';
import Colors from "./colors";
import LoadingSpinner from "../../_components/LoadingSpinner";
import ChartContainer from "./ChartContainer";

interface IBarChartProps {
  data: any[];
  dataKey: string;
  dataValue: string[];
  title?: string;
}

const BarComponent: React.FC<IBarChartProps> = ({ data, dataKey, dataValue, title }: IBarChartProps) => {

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
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={dataKey} />
            <YAxis />
            <Tooltip isAnimationActive={false} />
            <Legend onClick={selectBar} wrapperStyle={{ lineHeight: '18px' }}/>
            <Brush dataKey={dataKey} height={30} stroke="#8884d8" />
            {dataValue && dataValue.map((series, index) => (
              <Bar stackId="a" dataKey={series} key={`bar-${index}`} fill={Colors[index % Colors.length]}
                hide={barProps[series] === true} animationDuration={2000}
              />
            ))}
          </BarChart>:
        <LoadingSpinner />
      }
    </ChartContainer>
  );
}
export default BarComponent;
