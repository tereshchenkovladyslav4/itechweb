import React, { useState, useEffect } from "react";
import { trackPromise } from "react-promise-tracker";
import StockLineChart from "./HighChartsStockLine";
import { ChartNameIndex } from "./IFilteredChart";
import useIsMounted from "../_helpers/hooks/useIsMounted";
import useAsyncError from "../_helpers/hooks/useAsyncError";

export interface IStockPriceChartProps {
    service(ticker: string, grouping: number): any;
    area: string;
    title?: string;
    chartIndex: ChartNameIndex;
    series: string[];
}

const StockPrice: React.FC<IStockPriceChartProps> = ({ service, area, chartIndex, series }: IStockPriceChartProps) => {
    const isMounted = useIsMounted();
    const [data, setData] = useState<any>();
    const throwError = useAsyncError();

    useEffect(() => {
        trackPromise(service("F:BRN\\Z22", 3), area)
            .then((result: any) => {
                if(!isMounted()) return;
                const seriesArray = []
                if (result.length) {
                    const seriesCount = series.length;
                    for (let i = 0; i < seriesCount; i++) {
                        const s = result.map((x: any) => {
                            return [Date.parse(x.date), x[series[i]]]
                        });
                        seriesArray.push(s);
                    }
                }
                setData(seriesArray);
            })
            .catch((error: any) => {
                throwError(new Error(error?.message || error));
                });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // passed seriesclicked wants to display the menu... so chart woulf have to be a prop to ChartMenuWrapper
    return (
        <StockLineChart data={data} dataKey="key" dataValue={series} area={area} chartIndex={chartIndex} seriesName='' title="Stock Price" />
    );
}

StockPrice.displayName = "StockPrice";

export default StockPrice;