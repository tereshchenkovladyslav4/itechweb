import React, { useState, useEffect } from "react";
import { trackPromise } from "react-promise-tracker";
import ChartMenuWrapper from "../ChartMenuWrapper";
import BarChartHorizontal from "../HighChartBarChartHorizontal";
import { IFilteredChartProps } from "../IFilteredChart";
import useIsMounted from "../../_helpers/hooks/useIsMounted";
import { setTimeoutAsync } from "./TimeoutPromise";

const DemoTriggeredKeywordsChart: React.FC<IFilteredChartProps> = ({
  title,
  area,
  onChartMenuSelected,
  chartIndex,
}: IFilteredChartProps) => {
  const isMounted = useIsMounted();
  const [data, setData] = useState<any>();

  useEffect(() => {
    trackPromise(
      setTimeoutAsync(() => {
        if (isMounted()) {
          setData([
            { name: "Andrew Giles", count: 44 },
            { name: "Johnathon Smith", count: 26 },
            { name: "Mike Hawthorn", count: 22 },
            { name: "Maggie Andrews", count: 17 },
            { name: "Jeremy Jackson", count: 9 },
          ]);
        }
      }, 800),
      area
    );
  }, []);

  return (
    <ChartMenuWrapper
      Chart={BarChartHorizontal}
      callback={onChartMenuSelected}
      opt={{
        area: area,
        dataKey: "name",
        data: data,
        dataValue: ["count"],
        seriesName: "ownerName",
        title: title,
        chartIndex: chartIndex,
      }}
    />
  );
};

DemoTriggeredKeywordsChart.displayName = "TriggeredKeywordsChart";

export default DemoTriggeredKeywordsChart;
