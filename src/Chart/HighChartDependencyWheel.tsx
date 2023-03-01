import React, { useEffect, useMemo, useRef } from 'react';
import LoadingSpinner from "../_components/LoadingSpinner";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HC_exporting from 'highcharts/modules/exporting'
import { withResizeDetector } from 'react-resize-detector';
import { IChartProps } from './IChartProps';
import { useTheme } from '@mui/material';
import { setChartOptions } from './ChartOptions';
import HC_wheel from "highcharts/modules/dependency-wheel";
import HC_sankey from "highcharts/modules/sankey";

// add in optional modules
HC_sankey(Highcharts);
HC_wheel(Highcharts);
HC_exporting(Highcharts);


const containerStyle = { style: { width: "100%", height: "100%" } };

const DependencyWheelComponent: React.FC<IChartProps> = ({ data, title, area, width, height, seriesClicked, chartIndex }: IChartProps) => {
  const theme = useTheme();

  // series data needs to be an array of {from:string, to:string, weight:number}

  const onSeriesClick = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (seriesClicked) {
      seriesClicked({ value: e.point.name, x: e.clientX, y: e.clientY, chartIndex: chartIndex });
    }
  }

  const options: Highcharts.Options = useMemo(() => {
    return {
      title: {
        text: title
      },
      series: [{
        type: 'dependencywheel',
        data:  data?.map(x => ({from: x.from, to: x.to, weight: x.count})) || [],
        name: title + ' series',
        allowPointSelect: true,
        events: {
          click: onSeriesClick
        },
      }],
      dataLabels: {
        color: theme.palette.text.primary,
        style: {
            textOutline: 'none'
        },
        textPath: {
            enabled: true,
            attributes: {
                dy: 5
            }
        },
        distance: 10
    },
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, title]);

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
      {data ?
        <HighchartsReact
          highcharts={Highcharts}
          ref={chartComponent}
          options={options}
          containerProps={containerStyle}
        />
        : <LoadingSpinner area={area} />
      }
    </>
  );
}

export default withResizeDetector(DependencyWheelComponent);
