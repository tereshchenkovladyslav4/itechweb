import React, { useState, useEffect } from "react";
import { trackPromise } from "react-promise-tracker";
import { FileCountMonthly } from "../Model/iTechRestApi/FileCountMonthly";
import ChartMenuWrapper from "./ChartMenuWrapper";
import LineChart from "./HighChartLineChart";
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

const LineChartAllUserActivity: React.FC<IFilteredChartProps> = ({
  service,
  area,
  filterData,
  chartIndex,
  onChartMenuSelected,
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
  const classes = useStyles();
  const dataSource = ChartDataSources[chartIndex];
  const dataSourceDescription = selectors
    .getDataSources()
    .find((x) => x.name === dataSource)?.description;
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

        const cols = [
          ...new Set(result.map((item) => item.fileCounts.map((f) => f.fileType)).flat()),
        ] as string[];

        setColumns(cols);

        // create an object with all the properties from filetypes found
        const obj = { name: "" };

        cols.forEach((c) => Object.defineProperty(obj, c, { value: 0, enumerable: true }));

        const formattedResult = result.map((item) => {
          const t: any = { ...obj };

          t.name = `${item.year}-${item.month}`;

          item.fileCounts.forEach((f) => {
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
          Chart={LineChart}
          callback={onChartMenuSelected}
          opt={{
            area: area,
            dataKey: "name",
            data: data,
            dataValue: columns,
            seriesName: "iTechControlEventTypeDescription",
            // title: "All user activity",
            chartIndex: chartIndex,
          }}
        />
      </div>
    </div>
  );
};

LineChartAllUserActivity.displayName = "LineChartAllUserActivity";

export default LineChartAllUserActivity;
