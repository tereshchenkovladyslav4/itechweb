import React, { useEffect, useRef } from "react";
import LoadingSpinner from "../_components/LoadingSpinner";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HC_exporting from "highcharts/modules/exporting";
import highcharts3d from "highcharts/highcharts-3d";
import { withResizeDetector } from "react-resize-detector";
import { IChartProps } from "./IChartProps";
import { setChartOptions } from "./ChartOptions";
import { useTheme } from "@mui/material";
import { DefaultColors } from "./ChartColourConstants";

// add in optional modules
HC_exporting(Highcharts);
highcharts3d(Highcharts);

const LineComponent: React.FC<IChartProps> = ({
  data,
  dataKey,
  dataValue,
  title,
  area,
  width,
  height,
  seriesClicked,
  chartIndex,
}: IChartProps) => {
  const theme = useTheme();

  // series here is an array of {name:'', data[values...]}
  const series: Highcharts.SeriesOptionsType[] = [];

  dataValue?.forEach((x) => {
    series.push({ name: x, data: data?.map((d) => d[x]) } as Highcharts.SeriesOptionsType);
  });

  const onSeriesClick = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (seriesClicked) {
      // can get next date in series from e.point.series.data where category === e.point.category & index + 1
      const index = e.point.series.data.findIndex((d: any) => d.category === e.point.category);
      let endDate: string | undefined = undefined;
      if (index !== -1 && index < e.point.series.data.length - 1) {
        endDate = e.point.series.data[index + 1].category;
      }
      // isnt really a "value" as single series - just defined by date range
      const value = e.point.series.chart.series.length === 1 ? "" : e.point.series.name;
      seriesClicked({
        value: value,
        dateStart: e.point.category,
        dateEnd: endDate,
        x: e.clientX,
        y: e.clientY,
        chartIndex: chartIndex,
      });
    }
  };

  const options: Highcharts.Options = {
    title: {
      text: title,
    },
    xAxis: {
      categories: data?.map((x) => x[dataKey]),
    },
    yAxis: {
      title: {
        text: "Count",
      },
    },
    series: series,
    legend: {
      enabled: series?.length > 1,
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
    },
    colors: DefaultColors,
    chart: {
      type: "spline",
      // zoomType: "x",
      panKey: "shift",
      panning: {
        enabled: true,
        type: "x",
      },
      options3d: {
        enabled: false,
        alpha: 15,
        beta: 15,
        depth: 100,
      },
    },
    plotOptions: {
      spline: {
        dataLabels: {
          enabled: false,
        },
        events: {
          click: onSeriesClick,
        },
      },
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 550,
          },
          chartOptions: {
            legend: {
              align: "center",
              verticalAlign: "bottom",
              layout: "horizontal",
            },
          },
        },
      ],
    },
  };

  const chartComponent = useRef<any>(null);

  useEffect(() => {
    const chart = chartComponent.current?.chart;
    if (chart) {
      chart.reflow();
    }
  }, [width, height]);

  useEffect(() => {
    setChartOptions(theme);
  }, []);

  return (
    <>
      {data ? (
        <HighchartsReact
          highcharts={Highcharts}
          ref={chartComponent}
          options={options}
          containerProps={{ style: { width: "100%", height: "100%" } }}
        />
      ) : (
        <LoadingSpinner area={area} fixed={false} />
      )}
    </>
  );
};

export default withResizeDetector(LineComponent);
