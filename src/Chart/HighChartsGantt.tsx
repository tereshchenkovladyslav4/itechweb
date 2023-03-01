import React, { useEffect, useRef } from "react";
import * as Highcharts from "highcharts/highcharts-gantt";
import HighchartsReact from "highcharts-react-official";
import { IChartProps } from "./IChartProps";
import LoadingSpinner from "../_components/LoadingSpinner";
import { withResizeDetector } from "react-resize-detector";
import HC_exporting from "highcharts/modules/exporting";
import NoDataToDisplay from "highcharts/modules/no-data-to-display";
import { useTheme } from "@mui/material";
// import { dateFormat } from "highcharts/highcharts-gantt";
import HC_draggable from "highcharts/modules/draggable-points";
import { dateToTicks } from "../_helpers/dateConverter";
import { iTechDataTaskStatusEnum } from "../Model/iTechRestApi/iTechDataTaskStatusEnum";
import { toSentence } from "../_helpers/utilities";

HC_exporting(Highcharts);
NoDataToDisplay(Highcharts);
HC_draggable(Highcharts);

export interface TaskTime {
  id: number;
  start: number;
  end: number;
}
interface IDropProp {
  onDrop: (tasktime: TaskTime) => void;
  allowDrag: boolean;
}

// data[{start:   , end:   , completed:   , name:   , id:   , dependency:   , parent:    }]
const GanttChart: React.FC<IChartProps & IDropProp> = ({
  data,
  title,
  area,
  width,
  height,
  onDrop,
  allowDrag,
}: IChartProps & IDropProp) => {
  const theme = useTheme();
  const chartComponent = useRef<any>(null);
  // annoyingly the global Highcharts.setOptions has no effect on gantt charts
  const textStyle = { color: theme.palette.text.primary };
  const day = 1000 * 60 * 60 * 24;

  function _onDrop(this: any) {
    console.log(this);
    // this.id has the task rowId - this.start, this.end for changes
    const start = dateToTicks(this.start);
    const end = dateToTicks(this.end);
    const id = Number(this.id);

    onDrop({ id: id, start: start, end: end });
  }

  const series: Array<Highcharts.SeriesOptionsType> = data
    ? [
        {
          name: "Tasks",
          data: data,
          type: "gantt",
          dataLabels: [
            {
              enabled: true,
              formatter: function () {
                const val: any = this.series.data.find((x: any) => (this.point as any).id === x.id);
                const label = val.isAutomated ? "Automated" : `${val.completed * 100} %`;
                return label;
              },
            },
            {
              enabled: true,
              formatter: function () {
                const val: any = this.series.data.find((x: any) => (this.point as any).id === x.id);
                let label = "";
                if (!val.isAutomated && val.ownerName) {
                  label += ` ${val.ownerName}`;
                }
                return label;
              },
              align: "right",
              crop: false,
              overflow: "allow",
              x: 120,
              allowOverlap: true,
              style: textStyle,
            },
          ],
        },
      ]
    : [];

  const options = {
    yAxis: {
      uniqueNames: false,
      staticScale: 30, // set the default height for rows (default is 50)
      /* this sets the plot area as scrollable for the given number of entries defined by max.
       * However when expaning and contracting to show subtasks the row sizing grows and makes the chart look terrible
       */
      // scrollbar: {
      //     enabled: true,
      //     showFull: false
      // },
      // max:5,
      // min:0,
      labels: {
        style: textStyle,
        formatter: function () {
          const s: any = this.chart.series[0];
          const index = s.yData.findIndex((x: number) => x === this.pos);

          return `${data[index].name} <tspan x="350">${toSentence(
            iTechDataTaskStatusEnum[data[index].status]
          )}</tspan>`;
          // return `${data[index].name} <tspan x="350">${dateFormat(
          //   "%e %b",
          //   data[index].start
          // )}</tspan><tspan> &rarr; ${dateFormat("%e %b", data[index].end)}</tspan>`;
        },
      },
      title: {
        style: textStyle,
      },
      // type:"category", // the detault treegrid shows collapsable category levels.... but - you cant define multi columns in this mode
      // grid: data?.length ? {
      //   enabled:true,
      //   columns:[
      //     {
      //       title: {text:"Task"},
      //       categories: data.map((s) => s.name)
      //     },
      //     {
      //       title: {text:"From"},
      //       categories: data.map((s) => dateFormat('%e %b',s.start))
      //     }
      //   ]
      // } : undefined
    },
    xAxis: {
      currentDateIndicator: true,
      grid: {
        cellHeight: 30, // x-axis label height
      },
      max: data ? data[0].end + day : 0,
      labels: {
        style: textStyle,
      },
      title: {
        style: textStyle,
      },
    },
    navigation: {
      buttonOptions: {
        theme: {
          fill: theme.palette.background.paper,
        },
      },
    },
    legend: {
      itemStyle: textStyle,
    },
    navigator: {
      enabled: true,
      liveRedraw: true,
      series: {
        type: "gantt",
        pointPlacement: 0.5,
        pointPadding: 0.25,
      },
      yAxis: {
        min: 0,
        max: 3,
        reversed: true,
        categories: [],
      },
    },
    scrollbar: {
      enabled: true,
    },
    rangeSelector: {
      enabled: true,
      selected: 3,
      buttonTheme: { color: theme.palette.text.primary, fill: theme.palette.primary.main },
      labelStyle: textStyle,
    },
    title: {
      text: title,
      style: textStyle,
    },
    series: series,
    chart: {
      type: "gantt",
      zoomType: "x",
      panKey: "shift",
      panning: {
        enabled: true,
        type: "x",
      },
      style: {
        fontFamily: "Open Sans, Arial, Helvetica, sans-serif",
      },
      backgroundColor: theme.palette.background.paper,
    },
    plotOptions: {
      series: {
        // animation: false,
        allowPointSelect: allowDrag,
        dragDrop: {
          draggableX: allowDrag,
          draggableY: false,
          dragPrecisionX: day / (24 * 4), // Snap to 1/4 hour
        },
        point: {
          events: {
            drop: _onDrop,
          },
        },
      },
    },
  } as Highcharts.Options;

  useEffect(() => {
    const chart = chartComponent.current?.chart;
    if (chart) {
      chart.reflow();
    }
  }, [width, height]);

  return (
    <>
      {data ? (
        <HighchartsReact
          highcharts={Highcharts}
          constructorType={"ganttChart"}
          ref={chartComponent}
          options={options}
          // containerProps={containerStyle} // setting the usual 100% width / height messes up gantt charts
        />
      ) : (
        <LoadingSpinner area={area} />
      )}
    </>
  );
};

export default withResizeDetector(GanttChart);
