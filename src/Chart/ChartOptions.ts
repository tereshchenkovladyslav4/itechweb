import { Theme } from "@mui/material";
import Highcharts from "highcharts";

export const setChartOptions = (theme: Theme): void => {
  const textStyle = {
    color: theme.palette.text.primary,
    fontSize: `${theme.typography.body2.fontSize}px`,
  };

  Highcharts.setOptions({
    chart: {
      backgroundColor: theme.palette.background.paper,
    },
    title: {
      style: {
        color: theme.palette.text.primary,
        fontSize: `${theme.typography.body1.fontSize}px`,
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
    xAxis: {
      labels: {
        style: textStyle,
      },
      title: {
        style: textStyle,
      },
    },
    yAxis: {
      labels: {
        style: textStyle,
      },
      title: {
        style: textStyle,
      },
    },
    credits: {
      enabled: false,
    },
  });
};
