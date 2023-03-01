import React, { useEffect, useRef } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { IChartProps } from './IChartProps';
import LoadingSpinner from "../_components/LoadingSpinner";
import { withResizeDetector } from 'react-resize-detector';


Highcharts.setOptions({
    chart: {
        style: {
            fontFamily: "Open Sans, Arial, Helvetica, sans-serif"
        }
    }
  });

const containerStyle = { style: { width: "100%", height: "100%" } };

// data format: [[date ms, price],...]
const StockLineChart: React.FC<IChartProps> = ({ data, dataValue, title, area, width, height }: IChartProps) => {

    const chartComponent = useRef<any>(null);
    const series = data ? dataValue.map((x:any, i:number) => {return {name:x, data:data[i]}}) : [];
    const options = {
        rangeSelector: {
            buttons: [{
                type: 'hour',
                count: 1,
                text: '1h'
            }, {
                type: 'day',
                count: 1,
                text: '1D'
            },
            {
                type: 'month',
                count: 1,
                text: '1m'
            }, {
                type: 'all',
                count: 1,
                text: 'All'
            }],
            selected: 1,
            allButtonsEnabled: true
        },
        title: {
            text: title
        },
        series: series
    };
    
    useEffect(() => {
        const chart = chartComponent.current?.chart;
        if (chart) {
            chart.reflow();
        }
    }, [width, height]);

    return (
        <>
            {data ?
                <HighchartsReact
                    highcharts={Highcharts}
                    constructorType={"stockChart"}
                    ref={chartComponent}
                    options={options}
                    containerProps={containerStyle}
                />
                : <LoadingSpinner area={area} />
            }
        </>
    )
}

export default withResizeDetector(StockLineChart);
