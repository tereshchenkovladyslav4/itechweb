import HighchartsReact from "highcharts-react-official";
import React, { useState } from "react";
import Highcharts from "highcharts";
import highchartsMore from "highcharts/highcharts-more";
import solidGauge from "highcharts/modules/solid-gauge";

highchartsMore(Highcharts);
solidGauge(Highcharts);

export const Gauge = ({ percentage }: { percentage: number }) => {
  const [options] = useState({
    chart: {
      type: "solidgauge",
      backgroundColor: "rgba(0,0,0,0)",
    },

    title: null,

    pane: {
      center: ["50%", "30%"],
      size: 200,
      startAngle: -90,
      endAngle: 90,
      background: {
        innerRadius: "60%",
        outerRadius: "100%",
        shape: "arc",
      },
    },

    exporting: {
      enabled: false,
    },

    tooltip: {
      enabled: false,
    },

    // the value axis
    yAxis: {
      stops: [
        [0.1, "#55BF3B"], // green
        [0.5, "#DDDF0D"], // yellow
        [0.9, "#DF5353"], // red
      ],
      lineWidth: 0,
      tickWidth: 0,
      minorTickInterval: null,
      tickAmount: 2,
      min: 0,
      max: 100,
      title: {
        y: -70,
      },
      labels: {
        y: 16,
      },
    },

    plotOptions: {
      solidgauge: {
        dataLabels: {
          y: 5,
          borderWidth: 0,
          useHTML: true,
        },
      },
    },
    series: [
      {
        data: [percentage],
        dataLabels: {
          format:
            '<div style="text-align:center">' +
            '<span style="font-size:20px">{y} %</span><br/>' +
            "</div>",
        },
      },
    ],
  });
  return (
    <div style={{ height: 165, overflow: "hidden" }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};
