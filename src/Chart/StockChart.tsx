import React, { useState, useEffect } from "react";
import { trackPromise } from "react-promise-tracker";
import { IFilterData } from "../_services/graphService";
import StockChartHC from "./HighChartsStockChartActual";
import { ChartNameIndex, IChartSeries } from "./IFilteredChart";
import useIsMounted from "../_helpers/hooks/useIsMounted";
import useAsyncError from "../_helpers/hooks/useAsyncError";


export interface IStockChartProps {
    service(isin: string, filter?: IFilterData): any;
    area: string;
    filterData?: IFilterData;
    title?: string;
    onChartMenuSelected?(data: IChartSeries): void;
    chartIndex: ChartNameIndex;
}

const StockChart: React.FC<IStockChartProps> = ({ service, area, chartIndex }: IStockChartProps) => {
    const isMounted = useIsMounted();
    const [data, setData] = useState<any>();
    const throwError = useAsyncError();

    useEffect(() => {

        trackPromise(service("GB00H1JWPS06"), area) // TODO - select stock isin
            .then((result: any) => {
                if (!isMounted()) return;
                // want 2 series... ohlc & volume
                const stockData = {
                    ohlc: result.map((x: any) => { return [Date.parse(x.date), x.open, x.high, x.low, x.close] }),
                    volume: result.map((x: any) => { return [Date.parse(x.date), x.volume] })
                };
                setData([stockData]);
            })
            .catch(error => {
                throwError(new Error(error?.message || error));
          });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <StockChartHC data={data} dataKey="key" dataValue={[]} area={area} chartIndex={chartIndex} seriesName='' title="BRENT CRUDE" />
    );
}

StockChart.displayName = "StockChart";

export default StockChart;