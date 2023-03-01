import React, { useEffect, useMemo, useRef } from "react";
import LoadingSpinner from "../_components/LoadingSpinner";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HC_cloud from "highcharts/modules/wordcloud";
import HC_exporting from "highcharts/modules/exporting";
import { withResizeDetector } from "react-resize-detector";
import { IChartProps } from "./IChartProps";
import { useTheme } from "@mui/material";
import { setChartOptions } from "./ChartOptions";
import { DefaultColors } from "./ChartColourConstants";

// add in optional modules
HC_exporting(Highcharts);
HC_cloud(Highcharts);

const containerStyle = { style: { width: "100%", height: "100%" } };

const WordCloudComponent: React.FC<IChartProps> = ({
  data,
  title,
  area,
  width,
  height,
  seriesClicked,
  chartIndex,
}: IChartProps) => {
  const theme = useTheme();

  // series here is an array of {name:'', data[values...]}
  // const series: Highcharts.SeriesOptionsType[] = [];

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
      },
      series: [
        {
          type: "wordcloud",
          data: data.map((x) => {
            return { name: x.text, weight: x.value };
          }),
          name: "Occurrences",
          allowPointSelect: true,
          colors: DefaultColors,
          events: {
            click: onSeriesClick,
          },
          rotation: {
            from: -60,
            to: 60,
            orientations: 5,
          },
        },
      ],
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
        <LoadingSpinner area={area} />
      )}
    </>
  );
};

export default withResizeDetector(WordCloudComponent);
