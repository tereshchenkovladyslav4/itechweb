import React, { useEffect, useMemo, useRef } from "react";
import LoadingSpinner from "../_components/LoadingSpinner";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HC_exporting from "highcharts/modules/exporting";
import highcharts3d from "highcharts/highcharts-3d";
import { withResizeDetector } from "react-resize-detector";
import { IChartProps } from "./IChartProps";
import { useTheme } from "@mui/material";
import { setChartOptions } from "./ChartOptions";
import { DefaultColors } from "./ChartColourConstants";
import _ from "lodash";

// add in optional modules
HC_exporting(Highcharts);
highcharts3d(Highcharts);

const BarComponent: React.FC<IChartProps> = ({
  data,
  dataKey,
  dataValue,
  title,
  area,
  width,
  height,
  seriesClicked,
  chartIndex,
  colors,
}: IChartProps) => {
  const theme = useTheme();

  // series here is an array of {name:'', data[values...]}
  const series: Highcharts.SeriesOptionsType[] = [];
  let i = 0;
  dataValue?.forEach((x) => {
    if (!colors) {
      series.push({ name: x, data: data?.map((d) => d[x] || 0) } as Highcharts.SeriesOptionsType);
    } else {
      series.push({
        name: x,
        data: data?.map((d) => ({ y: d[x] || 0, color: colors[i++ % colors.length] })),
      } as Highcharts.SeriesOptionsType);
    }
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
      seriesClicked({
        value: e.point.series.name,
        dateStart: e.point.category,
        dateEnd: endDate,
        x: e.clientX,
        y: e.clientY,
        chartIndex: chartIndex,
      });
    }
  };
  const options: Highcharts.Options = useMemo(() => {
    return {
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
      chart: {
        type: "column",
        // zoomType: "x",
        backgroundColor: theme.palette.background.paper,
        panKey: "shift",
        panning: {
          enabled: true,
          type: "x",
        },
        options3d: {
          enabled: true,
          alpha: 8,
          beta: -3,
          depth: 46,
        },
      },
      colors: DefaultColors,
      plotOptions: {
        column: {
          stacking: "normal",
          colors: DefaultColors,
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
  }, [data, title]);

  const chartComponent = useRef<any>(null);

  // useEffect(() => {
  //   const chart = chartComponent.current?.chart;
  //   if (chart) {
  //     chart.reflow();
  //   }
  // }, [width, height]);

  
  const doReflow = () => {
    const chart = chartComponent.current?.chart;
    if (chart) {
      chart.reflow();
    }
  };

  const _debouncedReflow = useMemo(() => _.debounce(doReflow, 500), [])

  useEffect(() => {
    const chart = chartComponent.current?.chart;
    if (chart) {
        _debouncedReflow();
        // doReflow();
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

export default withResizeDetector(BarComponent);
