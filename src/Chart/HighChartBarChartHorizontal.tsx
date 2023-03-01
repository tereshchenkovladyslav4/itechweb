import React, { useEffect, useRef } from "react";
import LoadingSpinner from "../_components/LoadingSpinner";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highcharts3d from "highcharts/highcharts-3d";
import HC_exporting from "highcharts/modules/exporting";
import { withResizeDetector } from "react-resize-detector";
import { chartSeriesClick, IChartProps } from "./IChartProps";
import NoDataToDisplay from "highcharts/modules/no-data-to-display";
import { setChartOptions } from "./ChartOptions";
import { useTheme } from "@mui/material";
import { DefaultColors } from "./ChartColourConstants";

// add in optional modules
HC_exporting(Highcharts);
highcharts3d(Highcharts);
NoDataToDisplay(Highcharts);

const BarComponent: React.FC<IChartProps> = ({
  data,
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

  let i = 0;
  dataValue?.forEach((x) => {
    series.push({
      name: x,
      data: data?.map((d) => ({ y: d[x] || 0, color: DefaultColors[i++ % DefaultColors.length] })),
    } as Highcharts.SeriesOptionsType);
  });

  const onSeriesClick = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (seriesClicked) {
      const val: chartSeriesClick = {
        value: e.point.category,
        x: e.clientX,
        y: e.clientY,
        chartIndex: chartIndex,
      };
      if ((title?.indexOf("6 mths") || -1) > -1) {
        const now = new Date();
        now.setMonth(now.getMonth() - 6);
        const mth = "0" + (now.getMonth() + 1);
        const day = "0" + now.getDate();
        val.dateStart = `${now.getFullYear()}-${mth.slice(-2)}-${day.slice(-2)}`;
      }
      seriesClicked(val);
    }
  };

  const options: Highcharts.Options = {
    title: {
      text: title,
    },
    xAxis: {
      categories: data?.map((x) => x.name),
    },
    yAxis: {
      title: {
        text: "Count",
      },
    },
    series: series,
    colors: DefaultColors,
    legend: {
      enabled: series?.length > 1,
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
    },
    chart: {
      type: "bar",
      animation:false,
      // zoomType: "x",
      panKey: "shift",
      panning: {
        enabled: true,
        type: "x",
      },
      options3d: {
        enabled: true,
        
        alpha: 15,
        beta: -15,
        depth: 100,
      },
    },
    plotOptions: {
      bar: {
        stacking: "normal",
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
        <LoadingSpinner area={area} />
      )}
    </>
  );
};

export default withResizeDetector(BarComponent);
