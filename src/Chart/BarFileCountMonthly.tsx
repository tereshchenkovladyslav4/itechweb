import React, { useState, useEffect } from "react";
import { trackPromise } from "react-promise-tracker";
import { FileCount } from "../Model/iTechRestApi/FileCount";
import { FileCountMonthly } from "../Model/iTechRestApi/FileCountMonthly";
import ChartMenuWrapper from "./ChartMenuWrapper";
import BarChart from "./HighChartBarChart";
import {
  AddTimePeriodFilter,
  ApplyFilters,
  ChartDataSources,
  getDefaultTimePeriod,
  IFilteredChartProps,
  MapToDatasource,
} from "./IFilteredChart";
import useIsMounted from "../_helpers/hooks/useIsMounted";
import useAsyncError from "../_helpers/hooks/useAsyncError";
import TimePeriodDropdown from "../_components/TimePeriodDropdown";
import { useStore } from "../_context/Store";
import { getDynamicDateDatasourceColumn } from "../_helpers/helpers";
import { useStyles } from "./Chart.styles";
import { iTechDataWebFilterEnum } from "../Model/iTechRestApi/iTechDataWebFilterEnum";
import { AdvancedFilterModel } from "../Model/iTechRestApi/AdvancedFilterModel";
import ComponentFilterBreadCrumb from "../Filter/ComponentFilterBreadCrumb";
import { Typography } from "@mui/material";

const BarFileCountMonthly: React.FC<IFilteredChartProps> = ({
  service,
  filterData,
  area,
  onChartMenuSelected,
  chartIndex,
  updateData,
  filterGroup,
  groupFilters,
  title,
}: IFilteredChartProps) => {
  const isMounted = useIsMounted();
  const [data, setData] = useState<any>();
  const [columns, setColumns] = useState<string[]>([]);
  const throwError = useAsyncError();
  const { selectors } = useStore();
  const dataSource = ChartDataSources[chartIndex];
  const dataSourceDescription = selectors
    .getDataSources()
    .find((x) => x.name === dataSource)?.description;
  const classes = useStyles();
  const columnName = getDynamicDateDatasourceColumn(dataSource, selectors.getDataSources());
  const [timePeriod, setTimePeriod] = useState(getDefaultTimePeriod(filterData, columnName));
  const [appliedModels, setAppliedModels] = useState(groupFilters);
  const [chartTitle, setChartTitle] = useState(title);

  useEffect(() => {
    //save the change
    if (updateData) {
      updateData({ title: chartTitle });
    }
  }, [chartTitle]);

  const setTitle = (e: any) => {
    setChartTitle(e.target.innerText);
  };

  useEffect(() => {
    const models = selectors.getAllFilterModelsForDataSource(dataSource, filterGroup);
    if (models) {
      setAppliedModels((prev) =>
        prev ? new Map<iTechDataWebFilterEnum, AdvancedFilterModel>([...prev, ...models]) : models
      );
    }
  }, [
    JSON.stringify(
      Object.fromEntries(selectors.getAllFilterModelsForDataSource(dataSource, filterGroup) || [])
    ),
  ]);

  useEffect(() => {
    setData(undefined);
    AddTimePeriodFilter(timePeriod, filterData, columnName);

    const ds = MapToDatasource(appliedModels);
    const filters = ApplyFilters(dataSource, filterData, ds);

    if (updateData) {
      // can't just Json a Map<>
      const modelData = appliedModels ? Object.fromEntries(appliedModels) : undefined;
      // will also persist localfilters for timeperiod
      updateData({ groupFilters: modelData });
    }

    const controller = new AbortController();
    if (filters) {
      filters.signal = controller.signal;
    }

    trackPromise<FileCountMonthly[]>(service(filters), area)
      .then((result) => {
        if (!isMounted()) return;

        // get a distinct list of file types
        const cols = [
          ...new Set(result.map((item) => item.fileCounts.map((f) => f.fileType)).flat()),
        ] as string[];
        setColumns(cols);

        const formattedResult = result.map((item) => {
          const t: any = {
            name: `${item.year}-${item.month}`,
          };

          item.fileCounts.forEach((f: FileCount) => {
            t[f.fileType] = f.count;
          });
          return t;
        });
        setData(formattedResult);
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        throwError(new Error(error?.message || error));
      });

    return () => {
      // cancel the request
      controller.abort();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timePeriod, appliedModels]);

  return (
    <div className={classes.chartContainer}>
      <TimePeriodDropdown
        setValue={setTimePeriod}
        value={timePeriod}
        className={classes.timePeriod}
      />
      <div className={classes.filterBreadcrumbs}>
        <Typography
          onBlur={setTitle}
          variant="h5"
          contentEditable={true}
          suppressContentEditableWarning={true}
        >
          {chartTitle}
        </Typography>
        <ComponentFilterBreadCrumb
          filterModels={appliedModels}
          setFilterModels={setAppliedModels}
          dataSourceDescription={dataSourceDescription}
          filterGroup={filterGroup}
        />
      </div>
      <div className={classes.chart}>
        <ChartMenuWrapper
          Chart={BarChart}
          callback={onChartMenuSelected}
          opt={{
            area: area,
            dataKey: "name",
            data: data,
            //colors: DefaultColors,
            dataValue: columns,
            seriesName: "fileTypeDescription",
            // title: "File type count by month",
            chartIndex: chartIndex,
          }}
        />
      </div>
    </div>
  );
};

BarFileCountMonthly.displayName = "BarFileCountMonthly";

export default BarFileCountMonthly;
