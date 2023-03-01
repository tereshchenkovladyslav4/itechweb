import React, { useState, useEffect } from "react";
import { trackPromise } from "react-promise-tracker";
import { NamedCount } from "../Model/iTechRestApi/NamedCount";
import ChartMenuWrapper from "./ChartMenuWrapper";
import BarChartHorizontal from "./HighChartBarChartHorizontal";
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
import { useStyles } from "./Chart.styles";
import { useStore } from "../_context/Store";
import { getDynamicDateDatasourceColumn } from "../_helpers/helpers";
import TimePeriodDropdown from "../_components/TimePeriodDropdown";
import { iTechDataWebFilterEnum } from "../Model/iTechRestApi/iTechDataWebFilterEnum";
import { AdvancedFilterModel } from "../Model/iTechRestApi/AdvancedFilterModel";
import ComponentFilterBreadCrumb from "../Filter/ComponentFilterBreadCrumb";
import { Typography } from "@mui/material";

const Top5BarChartFilter: React.FC<IFilteredChartProps> = ({
  service,
  title,
  area,
  filterData,
  onChartMenuSelected,
  chartIndex,
  updateData,
  filterGroup,
  groupFilters,
}: IFilteredChartProps) => {
  const isMounted = useIsMounted();
  const [data, setData] = useState<any>();
  const throwError = useAsyncError();
  const classes = useStyles();
  const { selectors } = useStore();

  const dataSource = ChartDataSources[chartIndex];
  const dataSourceDescription = selectors
    .getDataSources()
    .find((x) => x.name === dataSource)?.description;
  const columnName = getDynamicDateDatasourceColumn(dataSource, selectors.getDataSources());

  const [timePeriod, setTimePeriod] = useState(getDefaultTimePeriod(filterData, columnName));
  const [appliedModels, setAppliedModels] = useState(groupFilters);

  const [chartTitle, setChartTitle] = useState(title);

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

    trackPromise<NamedCount[]>(service(filters), area)
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
  }, [timePeriod, appliedModels]);

  useEffect(() => {
    //save the change
    if(updateData){
      updateData({title:chartTitle});
    }
  },[chartTitle]);

  const setTitle = (e:any) => {
    setChartTitle(e.target.innerText);
  }

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
          Chart={BarChartHorizontal}
          callback={onChartMenuSelected}
          opt={{
            area: area,
            dataKey: "name",
            data: data,
            dataValue: ["count"],
            seriesName: "ownerName",
            chartIndex: chartIndex,
          }}
        />
      </div>
    </div>
  );
};

Top5BarChartFilter.displayName = "Top5Chart";

export default Top5BarChartFilter;
