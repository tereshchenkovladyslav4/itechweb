import React, { useState, useEffect } from "react";
import { trackPromise } from "react-promise-tracker";
import { NamedCount } from "../Model/iTechRestApi/NamedCount";
import ChartMenuWrapper from "./ChartMenuWrapper";
import BarChartHorizontal from "./HighChartBarChartHorizontal";
import {IFilteredChartProps} from "./IFilteredChart";
import useIsMounted from "../_helpers/hooks/useIsMounted";
import useAsyncError from "../_helpers/hooks/useAsyncError";

const Top5Chart: React.FC<IFilteredChartProps> = ({ service, title, area, filterData, onChartMenuSelected, chartIndex }: IFilteredChartProps) => {
    const isMounted = useIsMounted();
    const [data, setData] = useState<any>();
    const throwError = useAsyncError();

    useEffect(() => {

        trackPromise<NamedCount[]>(service(filterData), area)
            .then((result) => {
                if (!isMounted()) return;
                setData(result);
            })
            .catch(error => {
                throwError(new Error(error?.message || error));
          });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ChartMenuWrapper Chart={BarChartHorizontal} callback={onChartMenuSelected} opt={{ area: area, dataKey: "name", data: data, dataValue: ["count"], seriesName:"ownerName", title: title, chartIndex: chartIndex }} />
    );
}

Top5Chart.displayName = "Top5Chart";

export default Top5Chart;