import React, { useState, useEffect } from "react";
import { trackPromise } from "react-promise-tracker";
import GanttChart, { TaskTime } from "./HighChartsGantt";
import { ChartNameIndex } from "./IFilteredChart";
import useIsMounted from "../_helpers/hooks/useIsMounted";
import useAsyncError from "../_helpers/hooks/useAsyncError";
import { CaseTask } from "../Model/iTechRestApi/CaseTask";
import { useStore } from "../_context/Store";
import { IFilterData } from "../_services/graphService";
import { amber, blue, green, grey, purple, red, lightGreen } from "@mui/material/colors";
import { ticksToDate } from "../_helpers/dateConverter";
import { taskService } from "../_services/taskService";

export interface ICaseTaskChartProps {
    service(caseId: number, filterData?:IFilterData): Promise<CaseTask[]>;
    area: string;
    title?: string;
    chartIndex: ChartNameIndex;
    filterData?: IFilterData;
}

const CaseTaskGantt: React.FC<ICaseTaskChartProps> = ({ service, area, chartIndex, title, filterData }: ICaseTaskChartProps) => {
    const isMounted = useIsMounted();
    const [data, setData] = useState<any>();
    const throwError = useAsyncError();
    const { selectors } = useStore();
    const colors = [ // see iTechDataTaskStatusEnum
        '',
        grey[500],
        amber[500],
        red[500],
        blue[500],
        purple[500],
        green[800],
        lightGreen[300],
      ];

      function _onDrop(tasktime:TaskTime){
            taskService.updateDate(tasktime.id, tasktime.start, tasktime.end).
            catch((err) => {
                console.log(err);
            });
      }

    useEffect(() => {
        const caseId = selectors.getSelectedCaseId();
        if (caseId) {
            trackPromise(service(caseId, filterData), area)
                .then((result) => {
                    if (!isMounted()) return;

                    const start = result && result.length > 0 ? result[0].start : 0;
                    const d = result ? result.map((x:any) => {
                        if (x.start === null) x.start = start;
                
                        x.start = ticksToDate(x.start);
                        x.end = ticksToDate(x.end);
                        x.color = colors[x.status];

                        return x;
                    }) : undefined;
                    if(d)
                        setData(d);
                })
                .catch((error: any) => {
                    throwError(new Error(error?.message || error));
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectors.getSelectedCaseId()]);

    return (
        <GanttChart data={data} dataKey="key" dataValue={[]} area={area} chartIndex={chartIndex} seriesName='' title={title} onDrop={_onDrop} allowDrag={!selectors.getCaseClosed()} />
    );
}

CaseTaskGantt.displayName = "CaseTaskGantt";

export default CaseTaskGantt;