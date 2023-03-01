import React, { useState, useEffect } from "react";
import { trackPromise } from "react-promise-tracker";
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
import { ITechWebCollectionTotal } from "../Model/iTechRestApi/ITechWebCollectionTotal";
import { graphService } from "../_services/graphService";
import { Autocomplete, Grid, TextField, Typography } from "@mui/material";
import _ from "lodash";

const LineChartCollectionTotals: React.FC<IFilteredChartProps> = ({
  service,
  area,
  filterData,
  onChartMenuSelected,
  chartIndex,
  updateData,
  filterGroup,
  groupFilters,
  title,
  columnName,
  intitalTimePeriod,
  fixedFilters,
  dateColumn,
}: IFilteredChartProps) => {
  const isMounted = useIsMounted();
  const throwError = useAsyncError();
  const { selectors } = useStore();
  const dataSource = ChartDataSources[chartIndex];
  const dataSourceDescription = selectors
    .getDataSources()
    .find((x) => x.name === dataSource)?.description;
  const classes = useStyles();
  const dateColumnName = getDynamicDateDatasourceColumn(dataSource, selectors.getDataSources());
  const [timePeriod, setTimePeriod] = useState(
    getDefaultTimePeriod(filterData, dateColumnName, intitalTimePeriod)
  );

  const [appliedModels, setAppliedModels] = useState(groupFilters);
  const [chartTitle, setChartTitle] = useState(title);

  const [count, setCount] = useState<any>([]);
  const [dayOfWeekCnt, setdayOfWeekCnts] = useState<any>([]);
  const [selectedDay, setSelectedDay] = useState<any | null>(null);

  useEffect(() => {
        // get selection list data
        trackPromise(graphService.getCollectionLists(), area)
        .then((result) => {
          if (!isMounted()) return;
  
          if (result) {
            setdayOfWeekCnts(result.dayOfWeekCnt);
          }
        })
        .catch((error) => {
          throwError(new Error(error?.message || error));
        });
    }, []);
  
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
    setCount(undefined);
    // TODO - probably dont want timeperiod as have a date picker
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

    // TODO - add in any filters for company / datestart / file type

    // append any fixed filters here on a cloned instance so not persisted in localFilters
    if (filters && fixedFilters) {
      filters = _.cloneDeep(filters);
      fixedFilters.forEach((f) => filters && filters.localFilters.push(f));
    }

    trackPromise<ITechWebCollectionTotal[]>(service(filters, dataSource, columnName, dateColumn), area)
    .then((result) => {
      if (!isMounted()) return;
      setCount(result);
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
      {/* <TimePeriodDropdown
        setValue={setTimePeriod}
        value={timePeriod}
        className={classes.timePeriod}
      /> */}
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
      {/* <Grid xs={12} container item style={{ justifyContent: "center", marginTop: 35 }} spacing={2}>
        <Grid item xs={4} spacing={2}>
          <Autocomplete
            options={dayOfWeekCnt}
            size="small"
            getOptionLabel={(opt: any) => opt}
            onChange={(e, newVal) => setSelectedDay(newVal)}
            value={dayOfWeekCnt ? selectedDay || "" : ""}
            renderInput={(params) => (
              <TextField
                label="Days of the week"
                autoFocus
                placeholder="Filter days"
                {...params}
              />
            )}
          />
        </Grid>
      </Grid> */}
      <div className={classes.chart}>
        <ChartMenuWrapper
          Chart={LineChart}
          callback={onChartMenuSelected}
          opt={{
            area: area,
            dataKey: "name",
            data: count,
            dataValue: ["count"],
            seriesName: columnName || "",

            // title: "Files collected",
            chartIndex: chartIndex,
          }}
        />
      </div>
    </div>
  );
};

LineChartCollectionTotals.displayName = "LineChartCollectionTotals";

export default LineChartCollectionTotals;
