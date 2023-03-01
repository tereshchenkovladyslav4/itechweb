import React, { useState, useEffect } from "react";
import { trackPromise } from "react-promise-tracker";
import BarChart from "./HighChartBarChart";
import { Typography } from "@mui/material";

import {
  AddTimePeriodFilter,
  ApplyFilters,
  ChartDataSources,
  getDefaultTimePeriod,
  IFilteredChartProps,
  MapToDatasource,
} from "./IFilteredChart";
import ChartMenuWrapper from "./ChartMenuWrapper";
import useIsMounted from "../_helpers/hooks/useIsMounted";
import useAsyncError from "../_helpers/hooks/useAsyncError";
import { useStyles } from "./Chart.styles";
import { useStore } from "../_context/Store";
import { getDynamicDateDatasourceColumn } from "../_helpers/helpers";
import TimePeriodDropdown from "../_components/TimePeriodDropdown";
import { iTechDataWebFilterEnum } from "../Model/iTechRestApi/iTechDataWebFilterEnum";
import { AdvancedFilterModel } from "../Model/iTechRestApi/AdvancedFilterModel";
import ComponentFilterBreadCrumb from "../Filter/ComponentFilterBreadCrumb";
import _ from "lodash";
import { FileCount } from "../Model/iTechRestApi/FileCount";

const datavalue = ["count"];

const BarCount: React.FC<IFilteredChartProps> = ({
  service,
  area,
  filterData,
  onChartMenuSelected,
  chartIndex,
  title,
  colors,
  updateData,
  filterGroup,
  groupFilters,
  columnName,
  intitalTimePeriod,
  fixedFilters,
}: IFilteredChartProps) => {
  const isMounted = useIsMounted();
  const [data, setData] = useState<any>(); // leave undefined so dont draw a empty pie
  const throwError = useAsyncError();
  const classes = useStyles();
  const { selectors } = useStore();
  const dataSource = ChartDataSources[chartIndex];
  // Hard coded for now if not found as this datasource not configured in all DBs.
  const dateColumnName =
    getDynamicDateDatasourceColumn(dataSource, selectors.getDataSources()) || "DateInserted";
  const [timePeriod, setTimePeriod] = useState(getDefaultTimePeriod(filterData, dateColumnName, intitalTimePeriod));

  const dataSourceDescription = selectors
    .getDataSources()
    .find((x) => x.name === dataSource)?.description;

  const [appliedModels, setAppliedModels] = useState(groupFilters);
  const [chartTitle, setChartTitle] = useState(title);

  useEffect(() => {
    //save the change
    if(updateData){
      updateData({title:chartTitle});
    }
  },[chartTitle]);

  const setTitle = (e:any) => {
    setChartTitle(e.target.innerText);
  }

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
    AddTimePeriodFilter(timePeriod, filterData, dateColumnName);

    const ds = MapToDatasource(appliedModels);
    let filters = ApplyFilters(dataSource, filterData, ds);

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

    // append any fixed filters here on a cloned instance so not persisted in localFilters
    if (filters && fixedFilters) {
      filters = _.cloneDeep(filters);
      fixedFilters.forEach(f => filters && filters.localFilters.push(f));
    }

    trackPromise<FileCount[]>(service(filters, dataSource, columnName), area)
      .then((result) => {
        if (!isMounted()) return;
        setData(result);
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
  }, [
    timePeriod,
    appliedModels,
    JSON.stringify(fixedFilters),
  ]);

  // passed seriesclicked wants to display the menu... so chart would have to be a prop to ChartMenuWrapper
  return (
    <div className={classes.chartContainer}>
      <TimePeriodDropdown
        setValue={setTimePeriod}
        value={timePeriod}
        className={classes.timePeriod}
      />
      <div className={classes.filterBreadcrumbs}>
      <Typography onBlur={setTitle} variant='h5' contentEditable={true} suppressContentEditableWarning={true}>{chartTitle}</Typography> 
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
            dataValue: datavalue,
            seriesName: columnName || "",
            chartIndex: chartIndex,
            colors: colors,
          }}
        />
      </div>
    </div>
  );
};

BarCount.displayName = "BarCaseStatus";

export default BarCount;
