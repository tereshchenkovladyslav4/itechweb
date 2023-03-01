import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import Colors from './colors';
import ChartContainer from "./ChartContainer";
import LoadingSpinner from "../../_components/LoadingSpinner";

interface IPieProps {
  data: any[];
  dataKey: string;
  dataValue: string;
  title?: string;
}

const PieComponent: React.FC<IPieProps> = ({ data, dataKey, dataValue, title }: IPieProps) => {

  const renderLabel = (item: any) => {
    if (item.percent > 0.01)
      return item[dataKey];
  }

  return (

    <ChartContainer title={title}>
      {data && data.length ?
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            // label={(item) => item[dataKey]}
            label={renderLabel}
            fill="#8884d8"
            dataKey={dataValue}
            nameKey={dataKey}
            legendType="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={Colors[index % Colors.length]} />
            ))}
          </Pie>
          <Legend />
          <Tooltip />
        </PieChart> :
        <LoadingSpinner />
      }
    </ChartContainer>
  );
}
export default PieComponent;
