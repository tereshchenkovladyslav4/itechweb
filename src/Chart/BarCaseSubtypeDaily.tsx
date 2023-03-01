import React, { useState, useEffect } from "react";
import { trackPromise } from "react-promise-tracker";
import ChartMenuWrapper from "./ChartMenuWrapper";
import BarChart from "./HighChartBarChart";
import { IFilteredChartProps } from "./IFilteredChart";
import useIsMounted from "../_helpers/hooks/useIsMounted";
import useAsyncError from "../_helpers/hooks/useAsyncError";
import { CaseStatusCountByDay } from "../Model/iTechRestApi/CaseStatusCountByDay";
// import { iTechDataCaseSubTypeEnumStrings } from "./ChartEnumStrings";
// import { iTechDataCaseSubEnum } from "../Model/iTechRestApi/iTechDataCaseSubEnum";

const BarCaseSubtypeDaily: React.FC<IFilteredChartProps> = ({ service, filterData, area, onChartMenuSelected, chartIndex }: IFilteredChartProps) => {
    const isMounted = useIsMounted();
    const [data, setData] = useState<any>();
    const [columns, setColumns] = useState<string[]>([]);
    const throwError = useAsyncError();

    useEffect(() => {

        trackPromise<CaseStatusCountByDay[]>(service(filterData), area)
            .then((result) => {
                if (!isMounted()) return;

                // get a distinct list of case statii
                // TBD... the enum names dont match the abb / descriptions in the DB..
                // const cols = Object.values(iTechDataCaseSubEnum).filter(value => typeof value === 'string') as string[];
                // const cols = iTechDataCaseSubTypeEnumStrings;

                const cols = [
                    ...new Set(result.map((item) => item.caseCount.map((f) => f.caseStatus)).flat()),
                  ] as string[];
                  
                setColumns(cols);

                const formattedResult = result.map((item) => {
                    const t: any = {
                        name: item.date
                    };

                    item.caseCount.forEach((f) => {
                        t[f.caseStatus] = f.count;
                    });
                    return t;
                });
                setData(formattedResult);
            })
            .catch((error) => {
                throwError(new Error(error?.message || error));
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ChartMenuWrapper Chart={BarChart} callback={onChartMenuSelected} opt={{ area: area, dataKey: "name", data: data, dataValue: columns, seriesName: "caseStatusSubTypeAbb", title: "All cases by subtype daily", chartIndex: chartIndex }} />
    );
}

BarCaseSubtypeDaily.displayName = "BarCaseSubtypeDaily";

export default BarCaseSubtypeDaily;