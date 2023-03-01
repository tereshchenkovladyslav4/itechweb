import React, { useState, useEffect } from "react";
import { trackPromise } from "react-promise-tracker";
import PieChart from "../HighChartPieChart";
import { IFilteredChartProps } from "../IFilteredChart";
import ChartMenuWrapper from "../ChartMenuWrapper";
import useIsMounted from "../../_helpers/hooks/useIsMounted";
import { setTimeoutAsync } from "./TimeoutPromise";

const datavalue = ["count"];

const DemoPieCaseStatus: React.FC<IFilteredChartProps> = ({ area, onChartMenuSelected, chartIndex }: IFilteredChartProps) => {
    const isMounted = useIsMounted();
    const [data, setData] = useState<any>(); // leave undefined so dont draw a empty pie

    useEffect(() => {

        trackPromise(
            setTimeoutAsync(() => {
              if (isMounted()) {
                setData([
                  { caseStatus: "Waiting For Supervisor Review", count: 44 },
                  { caseStatus: "On Hold", count: 26 },
                  { caseStatus: "Working On It (User Interaction Required)", count: 22 },
                  { caseStatus: "Closed", count: 87 },
                  { caseStatus: "Stuck (Waiting On Internal)", count: 9 },
                ]);
              }
            }, 1000),
            area
          );
          
        // trackPromise<CaseStatusCount[]>(service(filterData), area)
        //     .then((result) => {
        //         if(!isMounted()) return;
        //         setData(result);
        //     })
        //     .catch((error) => {
        //         throwError(new Error(error?.message || error));
        //     });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // passed seriesclicked wants to display the menu... so chart would have to be a prop to ChartMenuWrapper
    return (
            <ChartMenuWrapper Chart={PieChart} callback={onChartMenuSelected} opt={{ area: area,  dataKey: "caseStatus", data: data, dataValue: datavalue, seriesName:"caseStatusTypeAbb", title:"Case count by status for last 31 days", chartIndex: chartIndex }} />
    );
}

DemoPieCaseStatus.displayName = "PieCaseStatus";

export default DemoPieCaseStatus;