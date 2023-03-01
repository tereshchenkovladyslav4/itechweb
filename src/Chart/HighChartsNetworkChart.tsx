import React, { useEffect, useMemo, useRef, useState } from "react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { IChartProps } from "./IChartProps";
import LoadingSpinner from "../_components/LoadingSpinner";
import { withResizeDetector } from "react-resize-detector";
import networkgraph from "highcharts/modules/networkgraph";
import { NetworkNode } from "../Model/iTechRestApi/NetworkNode";
import { useTheme } from "@mui/material";
import { setChartOptions } from "./ChartOptions";
import _ from "lodash";

networkgraph(Highcharts);

const containerStyle = { style: { width: "100%", height: "100%" } };
const minRadius = 10;

function processNetworkData(data:any[]){
    const formattedData = data ? data : [];

    const createNode = (
      prop: keyof NetworkNode,
      x: NetworkNode,
      minRadius: number,
      appearances: any,
      minCount: number,
      maxCount: number,
      colors: (string | Highcharts.GradientColorObject | Highcharts.PatternObject)[] | undefined,
      keys: string[]
    ): {
      name: string;
      id: string;
      marker: { radius: number };
      color: string | Highcharts.GradientColorObject | Highcharts.PatternObject| undefined;
      mass?: number;
      from: string;
      to: string;
    } => {
      const propName = (prop + "Name") as keyof NetworkNode;
      return {
        name: (x[propName] !== "Unknown User"
          ? x[propName]
          : String(x[prop]).split("@")[0].replace(".", " ")) as string,
        id: x[prop] as string,
        // scale the size of the node to the number of connections
        marker: {
          radius:
            (minRadius * 3 * (appearances[x[prop]] - minCount || 1)) / (maxCount - minCount + 1),
        },
        // mass:1,
        color: colors ? colors[keys.indexOf(String(x[prop])) % colors.length] : undefined,
        from: x.from,
        to: x.to,
      };
    };
  
    // count how many times each to / from appears i.e. weight for how many connections
    const appearances: any = {};
    if (data) {
      data.forEach((x) => {
        appearances[x.from] = (appearances[x.from] || 0) + 1;
        appearances[x.to] = (appearances[x.to] || 0) + 1;
      });
    }
    const properties: [string, number][] = Object.entries(appearances);
    const keys = Object.keys(appearances);
    const maxCount = data ? Math.max(...properties.map((o) => o[1]), 0) : 0;
    const minCount = data ? Math.min(...properties.map((o) => o[1]), Infinity) : 1;
    const colors = Highcharts.getOptions().colors;
    let nodes: Highcharts.SeriesNetworkgraphNodesOptions[] = data
      ? data.map((x) =>
          createNode("from", x, minRadius, appearances, minCount, maxCount, colors, keys) as Highcharts.SeriesNetworkgraphNodesOptions
        )
      : [];
  
    if (data) {
      // add in any names that only in to field
      const uniqueFroms = [...new Set(nodes.map((obj) => obj.id))];
      const tosToAdd: NetworkNode[] = [];
      data.forEach((x) => {
        if (uniqueFroms[x.to] === undefined && !tosToAdd.some((o) => o.to === x.to)) tosToAdd.push(x);
      });
  
      tosToAdd.forEach((x) =>
        nodes.push(createNode("to", x, minRadius, appearances, minCount, maxCount, colors, keys) as Highcharts.SeriesNetworkgraphNodesOptions )
      );
  
      // make distinct array of objects on id
      nodes = [...new Set(nodes.map((obj) => obj.id))].map((id) => {
        return nodes.find((obj) => obj.id === id);
      }) as Highcharts.SeriesNetworkgraphNodesOptions[];
  
    }

    return {formattedData, nodes};
}


// data format: [{from, to, name, count}]
const NetworkChart: React.FC<IChartProps> = ({ data, title, area, width, height }: IChartProps) => {
  const theme = useTheme();
  const chartComponent = useRef<any>(null);
//   const [chartData, setChartData] = useState(processNetworkData(data));
  const [chartData, setChartData] = useState({formattedData:[] as any[], nodes:[] as Highcharts.SeriesNetworkgraphNodesOptions[]});
  
  const options: Highcharts.Options = {
    chart: {
      type: "networkgraph",
    },
    // tooltip:{
    //     enabled:true,
    //     // pointFormat: 'chart level', // this just seems to be ignored
    //     // this is called but the only info available seems to be point not the node...
    //     formatter: function () {
    //         return '<b>' + this.point.options.from + '</b>';
    //     }
    // },
    title: {
      text: title,
    },
    series: [
      {
        dataLabels: {
          enabled: true,
          // linkFormat: '{point.fromNode.name} \u2192 {point.toNode.name} {point.count}',
          // linkFormat: '{point.count} \u2192 ',
          linkFormat: "{point.count}", // TODO - not sure we can correctly assume direction to show arrow
          color: theme.palette.text.primary,
        },
        data: chartData.formattedData,
        nodes: chartData.nodes,
        marker: {
          radius: minRadius,
        },
        type: "networkgraph",
      },
    ],
    plotOptions: {
      networkgraph: {
        allowPointSelect: true,
        turboThreshold: 0,
        layoutAlgorithm: {
          enableSimulation: true,
          maxIterations:80,
          friction: -0.9,
          linkLength: 40,
          // initialPositions: "circle",
        },
      },
    },
    responsive: {
      rules: [
        {
          condition: {
            // maxWidth: 550
          },
        },
      ],
    },
  };

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

  useEffect(() => {
    if(data){
        setChartData(processNetworkData(data));
    }
  }, [data]);

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

export default withResizeDetector(NetworkChart);
