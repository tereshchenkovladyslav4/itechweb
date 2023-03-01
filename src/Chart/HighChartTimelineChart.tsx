import React, { useEffect, useRef } from "react";
import LoadingSpinner from "../_components/LoadingSpinner";
import * as Highcharts from "highcharts";
import HC_xrange from "highcharts/modules/xrange";
import HighchartsReact from "highcharts-react-official";
import HC_exporting from "highcharts/modules/exporting";
import { withResizeDetector } from "react-resize-detector";
import { IChartProps } from "./IChartProps";
import { useTheme } from '@mui/material';
import { setChartOptions } from './ChartOptions';

// add in optional modules
HC_exporting(Highcharts);
HC_xrange(Highcharts);

const TimelineComponent: React.FC<IChartProps> = ({
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
  // series here is an array of {name:'', data[values...{x,x2,y}]}
  const series: Highcharts.SeriesXrangeOptions[] = [
    {
      name: "file type",
      type: "xrange",
      borderColor: "gray",
      minPointLength: 10,
      data: data,
    },
  ];
  const categories = dataValue;

  const onSeriesClick = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (seriesClicked) {
      seriesClicked({ value: e.point.rowId, x: e.clientX, y: e.clientY, chartIndex: chartIndex });
    }
  }

  const options: Highcharts.Options = {
    title: {
      text: '',//title,
      style:{height:20}
    },
    xAxis: {
      type: "datetime",
      minRange: 3600000, // 1 hour
    },
    yAxis: {
      title: {
        text: "", //"File Types",
      },
      categories: categories,
    },
    series: series,
    chart: {
      type: "xrange",
      // zoomType: "x", // or "xy"
      panKey: "shift",
      panning: {
        enabled: true,
        type: "x",
      },
    },
    legend:{
      enabled:false
    },
    plotOptions: {
      series: {
        turboThreshold: 0,
        point: {
          events: {
            click: onSeriesClick, 
          },
        },
      },
      xrange: {
        tooltip: {
          headerFormat:
            '<span style="font-size: 10px">{point.x:%A, %b %e, %H:%M:%S}</span><br/>',
        },
      },
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 550,
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

  useEffect(() =>{
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

export default withResizeDetector(TimelineComponent);
