import React, { useState, useEffect } from "react";
import { trackPromise } from "react-promise-tracker";
import ChartMenuWrapper from "../ChartMenuWrapper";
import BarChart from "../HighChartBarChart";
import { IFilteredChartProps } from "../IFilteredChart";
import useIsMounted from "../../_helpers/hooks/useIsMounted";
import { setTimeoutAsync } from "./TimeoutPromise";

const DemoBarDailyTriggers: React.FC<IFilteredChartProps> = ({
  area,
  onChartMenuSelected,
  chartIndex,
}: IFilteredChartProps) => {
  const isMounted = useIsMounted();
  const [data, setData] = useState<any>();
  const [columns, setColumns] = useState<string[]>([]);

  useEffect(() => {
    trackPromise(
      setTimeoutAsync(() => {
        if (isMounted()) {
          const result = [
            {
              year: "2022",
              month: "03",
              day: "01",
              fileCounts: [
                { count: 5, phrase: "Layering" },
                { count: 3, phrase: "not made aware" },
                { count: 1, phrase: "Money laundering" },
              ],
            },
            {
              year: "2022",
              month: "03",
              day: "02",
              fileCounts: [
                { count: 2, phrase: "Keep to ourselves" },
                { count: 1, phrase: "No inspection" },
              ],
            },
            {
              year: "2022",
              month: "03",
              day: "03",
              fileCounts: [
                { count: 3, phrase: "Market abuse" },
                { count: 1, phrase: "Money laundering" },
              ],
            },
            {
              year: "2022",
              month: "03",
              day: "04",
              fileCounts: [
                { count: 2, phrase: "not made aware" },
                { count: 2, phrase: "Keep to ourselves" },
              ],
            },
            {
              year: "2022",
              month: "03",
              day: "07",
              fileCounts: [
                { count: 2, phrase: "don’t involve Maggie" },
                { count: 2, phrase: "Discuss offline" },
              ],
            },
            {
              year: "2022",
              month: "03",
              day: "08",
              fileCounts: [],
            },
            {
              year: "2022",
              month: "03",
              day: "09",
              fileCounts: [],
            },
            {
              year: "2022",
              month: "03",
              day: "10",
              fileCounts: [
                { count: 1, phrase: "Keep to ourselves" },
                { count: 2, phrase: "Discuss offline" },
                { count: 2, phrase: "bat phone" },
              ],
            },
            {
              year: "2022",
              month: "03",
              day: "11",
              fileCounts: [
                { count: 3, phrase: "bad feeling" },
                { count: 2, phrase: "Layering" },
              ],
            },
            {
              year: "2022",
              month: "03",
              day: "12",
              fileCounts: [
                { count: 4, phrase: "Avoid loss" },
                { count: 2, phrase: "Discuss offline" },
              ],
            },
            {
              year: "2022",
              month: "03",
              day: "13",
              fileCounts: [
                { count: 2, phrase: "Bribe" },
                { count: 1, phrase: "Gray area" },
                { count: 1, phrase: "Distort" },
              ],
            },
            {
              year: "2022",
              month: "03",
              day: "14",
              fileCounts: [
                { count: 4, phrase: "Cover up" },
                { count: 1, phrase: "bat phone" },
              ],
            },

            {
              year: "2022",
              month: "03",
              day: "15",
              fileCounts: [],
            },
            {
              year: "2022",
              month: "03",
              day: "16",
              fileCounts: [],
            },
            {
              year: "2022",
              month: "03",
              day: "17",
              fileCounts: [
                { count: 1, phrase: "Keep to ourselves" },
                { count: 2, phrase: "Discuss offline" },
                { count: 2, phrase: "bat phone" },
              ],
            },
            {
              year: "2022",
              month: "03",
              day: "18",
              fileCounts: [
                { count: 3, phrase: "bad feeling" },
                { count: 2, phrase: "Discuss offline" },
              ],
            },
            {
              year: "2022",
              month: "03",
              day: "19",
              fileCounts: [
                { count: 4, phrase: "Avoid loss" },
                { count: 4, phrase: "Layering" },
              ],
            },
            {
              year: "2022",
              month: "03",
              day: "20",
              fileCounts: [
                { count: 1, phrase: "Bribe" },
                { count: 3, phrase: "Gray area" },
                { count: 2, phrase: "Distort" },
              ],
            },
            {
              year: "2022",
              month: "03",
              day: "21",
              fileCounts: [
                { count: 4, phrase: "bat phone" },
                { count: 1, phrase: "Cover up" },
              ],
            },

            {
              year: "2022",
              month: "03",
              day: "22",
              fileCounts: [],
            },
            {
              year: "2022",
              month: "03",
              day: "23",
              fileCounts: [],
            },
            {
              year: "2022",
              month: "03",
              day: "24",
              fileCounts: [
                { count: 1, phrase: "Keep to ourselves" },
                { count: 2, phrase: "Discuss offline" },
                { count: 2, phrase: "bat phone" },
              ],
            },
            {
              year: "2022",
              month: "03",
              day: "25",
              fileCounts: [
                { count: 3, phrase: "Gray area" },
                { count: 2, phrase: "Discuss offline" },
              ],
            },
            {
              year: "2022",
              month: "03",
              day: "26",
              fileCounts: [
                { count: 3, phrase: "Market abuse" },
                { count: 4, phrase: "Layering" },
              ],
            },
            {
              year: "2022",
              month: "03",
              day: "27",
              fileCounts: [
                { count: 1, phrase: "bat phone" },
                { count: 4, phrase: "Cover up" },
              ],
            },
            {
              year: "2022",
              month: "03",
              day: "28",
              fileCounts: [
                { count: 1, phrase: "Gray area" },
                { count: 3, phrase: "Bribe" },
                { count: 2, phrase: "Distort" },
              ],
            },
          ];

          const cols = [
            ...new Set(result.map((item) => item.fileCounts.map((f) => f.phrase)).flat()),
          ] as string[];
          setColumns(cols);

          const formattedResult = result.map((item) => {
            const t: any = {
              name: `${item.year}-${item.month}-${item.day}`,
            };

            item.fileCounts.forEach((f) => {
              t[f.phrase] = f.count;
            });
            return t;
          });
          setData(formattedResult);
        }
      }, 1000),
      area
    );
  }, []);

  return (
    <ChartMenuWrapper
      Chart={BarChart}
      callback={onChartMenuSelected}
      opt={{
        area: area,
        dataKey: "name",
        data: data,
        dataValue: columns,
        seriesName: "fileTypeDescription",
        title: "Trigger words by day",
        chartIndex: chartIndex,
      }}
    />
  );
};

DemoBarDailyTriggers.displayName = "BarDailyTriggers";

export default DemoBarDailyTriggers;
