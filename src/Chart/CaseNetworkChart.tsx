import React, { useState, useEffect } from "react";
import { trackPromise } from "react-promise-tracker";
import NetworkChart from "./HighChartsNetworkChart";
import { IFilteredChartProps } from "./IFilteredChart";
import useIsMounted from "../_helpers/hooks/useIsMounted";
import useAsyncError from "../_helpers/hooks/useAsyncError";

const CaseNetworkChart: React.FC<IFilteredChartProps> = ({ service, area, filterData, chartIndex, title }: IFilteredChartProps) => {
    const isMounted = useIsMounted();
    const [data, setData] = useState<any>(); // leave undefined so dont draw a empty chart
    const throwError = useAsyncError();

    useEffect(() => {
        trackPromise<any[]>(service(filterData), area)
            .then((result) => {
                if (!isMounted()) return;
                setData(result);
            })
            .catch((error) => {
                throwError(new Error(error?.message || error));
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <NetworkChart area={area} data={data} dataValue={[]} title={title ?? "Case Relationships"} dataKey={""} seriesName={""} chartIndex={chartIndex} />
    );
}

CaseNetworkChart.displayName = "CaseNetworkChart";

export default CaseNetworkChart;