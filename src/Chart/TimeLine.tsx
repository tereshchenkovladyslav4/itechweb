import React, { useState, useEffect } from "react";
import { trackPromise } from "react-promise-tracker";
import { TimelineData } from "../Model/iTechRestApi/TimelineData";
import ChartMenu from "./ChartMenu";
import TimeLineChart from "./HighChartTimelineChart";
import { chartSeriesClick } from "./IChartProps";
import {
  AddTimePeriodFilter,
  ApplyFilters,
  ChartDataSources,
  eChartMenuOption,
  getDefaultTimePeriod,
  IFilteredChartProps,
  MapToDatasource,
} from "./IFilteredChart";
import { useStore } from "../_context/Store";
import { dataService } from "../_services/dataService";
import { updateGridRowAction } from "../_context/actions/PageDataActions";
import { useHistory } from "react-router-dom";
import useAsyncError from "../_helpers/hooks/useAsyncError";
import useIsMounted from "../_helpers/hooks/useIsMounted";
import { hasPreviewOrProperties, onOpenFullscreen, onOpenNewTab } from "../_helpers/fileActions";
import { showHiddenAction } from "../_context/actions/HiddenActions";
import TimePeriodDropdown from "../_components/TimePeriodDropdown";
import { getDynamicDateDatasourceColumn } from "../_helpers/helpers";
import { useStyles } from "./Chart.styles";
import { iTechDataWebFilterEnum } from "../Model/iTechRestApi/iTechDataWebFilterEnum";
import { AdvancedFilterModel } from "../Model/iTechRestApi/AdvancedFilterModel";
import ComponentFilterBreadCrumb from "../Filter/ComponentFilterBreadCrumb";
import { Typography } from "@mui/material";

const initialState = {
  mouseX: null,
  mouseY: null,
};

const TimeLine: React.FC<IFilteredChartProps> = ({
  service,
  title,
  area,
  filterData,
  chartIndex,
  updateData,
  filterGroup,
  groupFilters,
}: IFilteredChartProps) => {
  const isMounted = useIsMounted();
  const [data, setData] = useState<any>();
  const [series, setSeries] = useState<string[]>([]);
  const [selectedValue, setSelectedValue] = useState<string>("");
  const { dispatch, selectors } = useStore();
  const history = useHistory();
  const throwError = useAsyncError();
  const classes = useStyles();

  const dataSource = ChartDataSources[chartIndex];
  const dataSourceDescription = selectors
    .getDataSources()
    .find((x) => x.name === dataSource)?.description;

  const columnName = getDynamicDateDatasourceColumn(dataSource, selectors.getDataSources());
  const [timePeriod, setTimePeriod] = useState(getDefaultTimePeriod(filterData, columnName));

  const [appliedModels, setAppliedModels] = useState(groupFilters);

  const [state, setState] = React.useState<{
    mouseX?: null | number;
    mouseY?: null | number;
  }>(initialState);

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
 
  const handleClose = () => {
    setState(initialState);
  };

  const handleMenuOptionClicked = (option: eChartMenuOption) => {
    switch (option) {
      case eChartMenuOption.open:
        onOpen(selectedValue);
        break;
      case eChartMenuOption.openFullScreen:
        onOpenFullscreen(selectedValue, () => dispatch(showHiddenAction(true)), onOpen);
        break;
      case eChartMenuOption.openInNewTab:
        onOpenNewTab(history, selectedValue);
        break;
    }
  };

  const onOpen = (gid: string) => {
    return trackPromise(dataService.gid(dataSource, gid), area).then(
      (result) => {
        result.datasource = dataSource;
        dispatch(updateGridRowAction(result));
      },
      (error) => {
        throwError(new Error(error?.message || error));
      }
    );
  };

  const handleMenuOptionClickedHC = (event: chartSeriesClick) => {
    setState({ mouseX: event.x, mouseY: event.y });
    setSelectedValue(event.value);
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

    trackPromise<TimelineData[]>(service(filters), area)
      .then((result) => {
        if (!isMounted()) return;

        const categories = [...new Set(result.map((item) => item.series))].sort((x, y) =>
          y.localeCompare(x)
        );
        setSeries(categories);

        const formattedResult = result.map((item) => ({
          x: item.ticks,
          x2: item.ticks || 0,
          y: categories.indexOf(item.series),
          rowId: item.rowId,
        }));

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

  const hasPrevOrProperties = hasPreviewOrProperties();

  let menuActions = [
    eChartMenuOption.open,
    eChartMenuOption.openFullScreen,
    eChartMenuOption.openInNewTab,
  ];
  if (!hasPrevOrProperties) {
    menuActions = menuActions.slice(1);
  }
  // different menu actions for this chart so we handle events here and dont use the MenuWrapper
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
        <TimeLineChart
          area={area}
          data={data}
          dataValue={series}
          title={chartTitle}
          dataKey={""}
          seriesName={""}
          chartIndex={chartIndex}
          seriesClicked={handleMenuOptionClickedHC}
        />
        <ChartMenu
          el={state}
          close={handleClose}
          clicked={handleMenuOptionClicked}
          actions={menuActions}
        />
      </div>
    </div>
  );
};

TimeLine.displayName = "TimeLine";

export default TimeLine;
