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

// add in optional modules
HC_exporting(Highcharts);
highcharts3d(Highcharts);

// Radialize the colors
const colors = Highcharts.getOptions().colors?.map((color) => {
  return {
    radialGradient: {
      cx: 0.5,
      cy: 0.3,
      r: 0.7,
    },
    stops: [
      [0, color],
      [1, Highcharts.color(color).brighten(-0.3).get("rgb")], // darken
    ],
  };
});

const containerStyle = { style: { width: "100%", height: "100%" } };

const PieComponent: React.FC<IChartProps> = ({
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
  // series here is an array of {name:'', data[values...]}
  const series: Highcharts.SeriesOptionsType[] = [];
  const theme = useTheme();

  dataValue?.forEach((x) => {
    series.push({
      name: x,
      //colors: colors,
      data: data?.map((d) => {
        return { y: d[x] || 0, name: d[dataKey] || "" };
      }),
    } as Highcharts.SeriesOptionsType);
  });

  const onSeriesClick = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (seriesClicked) {
      seriesClicked({ value: e.point.name, x: e.clientX, y: e.clientY, chartIndex: chartIndex });
    }
  };

  const options: Highcharts.Options = useMemo(() => {
    return {
      title: {
        text: title,
        // style: {"color": theme.palette.text.primary} // TODO - see if we can set all theme colors in SetOptions
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
      // if want the legend to appear at the side
      // legend: {
      //   enabled: data?.length > 1,
      //   layout: 'vertical',
      //   align: 'right',
      //   verticalAlign: 'middle'
      // },
      chart: {
        type: "pie",
        backgroundColor: theme.palette.background.paper,
        options3d: {
          enabled: true,
          alpha: 45,
          beta: 0,
        },
      },
      // navigation:{
      //   buttonOptions:{
      //     theme:{
      //       fill: theme.palette.background.paper
      //     }
      //   }
      // },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          innerSize: "30%", // makes it a donut
          depth: 40,
          colors: DefaultColors,
          dataLabels: {
            enabled: true,
            format: '<b style="font-size: 12px">{point.name}</b>: {point.percentage:.1f} %',
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          },
          // showInLegend:data?.length > 1, // don't show legend
        },
        series: {
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
              // legend: {
              //   align: 'center',
              //   verticalAlign: 'bottom',
              //   layout: 'horizontal'
              // }
            },
          },
        ],
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, title]);

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
          containerProps={containerStyle}
        />
      ) : (
        <LoadingSpinner area={area} fixed={false} />
      )}
    </>
  );
};

export default withResizeDetector(PieComponent);
