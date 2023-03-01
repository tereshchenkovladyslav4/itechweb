import React, { useState, useEffect } from "react";
import { trackPromise } from "react-promise-tracker";
import PieChart from "./HighChartPieChart";
import { IFilteredChartProps } from "./IFilteredChart";
import ChartMenuWrapper from "./ChartMenuWrapper";
import useIsMounted from "../_helpers/hooks/useIsMounted";
import useAsyncError from "../_helpers/hooks/useAsyncError";
import { TaskCount } from "../Model/iTechRestApi/TaskCount";

const datavalue = ["count"];

const PieTaskStatus: React.FC<IFilteredChartProps> = ({ service, area, filterData, onChartMenuSelected, chartIndex }: IFilteredChartProps) => {
    const isMounted = useIsMounted();
    const [data, setData] = useState<any>(); // leave undefined so dont draw a empty pie
    const throwError = useAsyncError();

    useEffect(() => {
        trackPromise<TaskCount[]>(service(filterData), area)
            .then((result) => {
                if(!isMounted()) return;
                setData(result);
            })
            .catch((error) => {
                throwError(new Error(error?.message || error));
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // passed seriesclicked wants to display the menu... so chart would have to be a prop to ChartMenuWrapper
    return (
            <ChartMenuWrapper Chart={PieChart} callback={onChartMenuSelected} opt={{ area: area,  dataKey: "description", data: data, dataValue: datavalue, seriesName:"taskStatusTypeDescription", title:"Task count by status", chartIndex: chartIndex }} />
    );
}

PieTaskStatus.displayName = "PieTaskStatus";

export default PieTaskStatus;