import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import LoadingSpinner from "../../_components/LoadingSpinner";
import ChartContainer from "./ChartContainer";
import { useTheme } from '@mui/material/styles';

interface IBarChartProps {
  data: any[];
  dataKey: string;
  dataValue: string[];
  title?: string;
}

const BarComponentHorizontal: React.FC<IBarChartProps> = ({ data, dataKey, dataValue, title }: IBarChartProps) => {
  const theme = useTheme();
  return (
    <ChartContainer title={title}>
      {data && data.length ?
          <BarChart
            width={500}
            height={300}
            data={data}
            layout="vertical" 
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey={dataKey} />
            <Tooltip />
            {dataValue && dataValue.map((series, index) => (
              <Bar dataKey={series} key={`vbar-${index}`} fill={theme.palette.primary.main} />
            ))}
          </BarChart>:
        <LoadingSpinner />
      }
    </ChartContainer>
  );
}
export default BarComponentHorizontal;
