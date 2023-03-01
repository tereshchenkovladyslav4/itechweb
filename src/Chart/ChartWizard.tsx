import _ from "lodash";
import React from "react";
import BarFileCountMonthly from "../Chart/BarFileCountMonthly";
// import StockChartDemo from "../Chart/HighChartsStockChart";
import LineChartAllUserActivity from "../Chart/LineChartAllUserActivity";
import LineCount from "./LineCount";
import PieCount from "./PieCount";
import StockChartWithList from "../Chart/StockChartWithList";
import StockPriceChart from "../Chart/StockPrice";
import { graphService } from "../_services/graphService";
import {
  ChartDataSources,
  ChartNameIndex,
  Charts,
  eChartMenuOption,
  getNameByIndex,
  getVirtualTable,
  IChartSeries,
  ReverseSortCharts,
} from "./IFilteredChart";
import {
  AddSearchTextEvent,
  AddTabWithGridEvent,
  trigger,
} from "../_helpers/events";
import { useStore } from "../_context/Store";
import { applyGraphFiltersAction } from "../_context/actions/PageDataActions";
import { iTechControlFileEnum } from "../Model/iTechRestApi/iTechControlFileEnum";

// import StockChart from "../Chart/StockChart";
import Top5Chart from "../Chart/Top5BarChart";
import WordCloud from "../Chart/WordCloudHC"; // or swap to other component as "../Chart/WordCloud";
import { AdvancedFilterModel } from "../Model/iTechRestApi/AdvancedFilterModel";
import { Filter } from "../Model/iTechRestApi/Filter";
import TimeLine from "./TimeLine";
import CaseNetworkChart from "./CaseNetworkChart";
import PieCaseStatus from "./PieCaseStatus";
import BarCaseStatusDaily from "./BarCaseStatusDaily";
import BarOpenCaseSubtypeDaily from "./BarOpenCaseSubtypeDaily";
import BarCaseSubtypeDaily from "./BarCaseSubtypeDaily";
import ChartList from "./ChartList";
import CaseTaskGantt from "./CaseTaskGantt";
import PieTaskOutcome from "./PieTaskOutcome";
import PieTaskStatus from "./PieTaskStatus";
import { tableService } from "../_services/tableService";
import { useDataSources } from "../_context/thunks/dataSources";
import WordCloudDemo from "../Chart/Demo/DemoWordCloudHC";
import DemoTriggeredKeywordsChart from "../Chart/Demo/DemoTriggeredKeywords";
import DemoPieCaseStatus from "../Chart/Demo/DemoPieCaseStatus";
import DemoBarDailyTriggers from "../Chart/Demo/DemoBarDailyTriggers";
import { Operations } from "../Filter/Operations";
import Top5BarChartFilter from "./Top5BarChartFilter";
import BarCount from "./BarCount";
// import { amber, green, lightGreen, pink, red } from "@mui/material/colors";
import { FilterGroup } from "../Model/Types/FilterGroup";
import { iTechDataWebFilterEnum } from "../Model/iTechRestApi/iTechDataWebFilterEnum";
import DependencyChart from "./DependencyChart";
import PersonNetworkChart from "./PersonNetworkChart";
import { TimePeriodEnum } from "../Model/iTechRestApi/TimePeriodEnum";
import { iTechControlColumnEnum } from "../Model/iTechRestApi/iTechControlColumnEnum";
import LineChartCollectionTotals from "./LineChartCollectionTotals";
import DemoWorldMaps from "./Demo/DemoWorldMaps";

interface IChartWizardProps {
  componentType: string;
  data: any;
  updateData(data: any): void;
  tableService: typeof tableService;
  area: string;
}

const getChartFilters = (chart: ChartNameIndex): any[] => {
  let expressions: any[] = [];
  switch (chart) {
    case ChartNameIndex.Top5UserEmailFiles:
      expressions = [
        iTechControlFileEnum.eml,
        iTechControlFileEnum.iTechMdEmail,
        iTechControlFileEnum.bloombergEmail,
        iTechControlFileEnum.bloombergEmailIm,
      ];
      break;
    case ChartNameIndex.Top5UserSMSFiles:
      expressions = [
        iTechControlFileEnum.iTechSms,
        iTechControlFileEnum.iTechMdSms,
      ];
      break;
    case ChartNameIndex.Top5UserVoiceFiles:
      expressions = [
        iTechControlFileEnum.iTechPbx,
        iTechControlFileEnum.iTechMVce,
        iTechControlFileEnum.wma,
        iTechControlFileEnum.iTechTurret,
        iTechControlFileEnum.moviusVoice,
        iTechControlFileEnum.whatsAppVoice,
        iTechControlFileEnum.teleMessVoice,
        iTechControlFileEnum.cloud9Pbx,
        iTechControlFileEnum.wav,
        iTechControlFileEnum.iTechCiscoWebEx,
      ];
      break;

    default:
      break;
  }

  return expressions.map((x) => {
    return {
      name: "iTechControlFileTypeRowId",
      operation: "EQUALS",
      value: x,
      iTechControlColumnTypeRowId: 5,
    };
  });
};

// build AdvancedFilterModel for the given chart series and filters
// will return an advancedFilterModel with single datasource with chart data filters
function buildFilterModel(
  filters: any,
  selectedData: IChartSeries,
  dateFieldName: string,
  chartData: any
) {
  let item = filters.filter((x: any) => x.name === selectedData.name)[0];

  if (item) {
    item.value = selectedData.value.trimEnd();
  } else if (selectedData.name === "ownerName") {
    // special case currently as ownername used by api for counts - owner has other characters and possibly multiple names
    // so would require a "like" or similar in sql.
    filters.push({
      name: selectedData.name,
      value: selectedData.value,
      operation: "EQUALS",
      iTechControlColumnTypeRowId: 9,
    });
  }

  if (selectedData.dateStart) {
    item = filters.filter((x: any) => x.name === dateFieldName)[0];
    if (item) {
      item.value = selectedData.dateStart;
      item.operation = "GREATER THAN OR EQUALS";
    }
  }
  if (selectedData.dateEnd) {
    item = _.cloneDeep(filters.filter((x: any) => x.name === dateFieldName)[0]);
    if (item) {
      item.value = selectedData.dateEnd;
      item.operation = "LESS THAN";
      filters.push(item);
    }
  }

  const mapToFilter = (x: any) =>
    ({
      name: x.name,
      rowId: x.rowId,
      id: x.rowId,
      operation: x.operation || "EQUALS",
      value: x.value,
      iTechControlColumnTypeRowId: x.iTechControlColumnTypeRowId,
      iTechControlColumnType: x.iTechControlColumnType,
      filters: [],
      isLogin: false,
    } as Filter);

  let activeFilters = filters.filter((x: any) => !!x.value);

  const staticFilters = getChartFilters(selectedData.chartIndex);
  // append any extra chart filters
  if (staticFilters.length) {
    activeFilters = activeFilters.concat(staticFilters);
  }
  const newFilter: AdvancedFilterModel = {
    id: "",
    name: "Graph",
    rowId: chartData.rowId,
    dataSources: [
      {
        name: ChartDataSources[selectedData.chartIndex],
        rowId: chartData.rowId,
        id: chartData.iTechControlTableRowId,
        rule: "AND",
        filters: activeFilters.map(mapToFilter),
      },
    ],
  };

  return newFilter;
}

// this must match the number of risk levels - ordered from very low to very high
const caseRiskColors = ["#00876c", "#89bf77", "#fff18f", "#f59b56", "#d43d51"]; //[green[500], lightGreen[500], amber[500], amber[900], red[600]];

const ChartWizard: React.FC<IChartWizardProps> = ({
  componentType,
  data,
  updateData,
  tableService,
  area,
}) => {
  const { dispatch, selectors } = useStore();
  let chartData = data?.data; // set if a filtered chart
  const caseId = selectors.getSelectedCaseId();
  const dataSourceList = useDataSources(tableService.getAll);

  const isFiltered =
    !!caseId || chartData?.subItems?.some((x: any) => x.value?.length > 0);

  // call back for the chart point click menu options
  const chartMenuSelected = (selectedData: IChartSeries) => {
    // These really need to come from the chart dependent on the data retrieved.
    const dateFieldName =
      ChartDataSources[selectedData.chartIndex] === "iTechWebSim"
        ? "obDateCreatedString"
        : "dateInsertedString";

    if (ReverseSortCharts.includes(ChartDataSources[selectedData.chartIndex])) {
      chartData.sortDirection = "DESC";
    }
    if (!chartData?.subItems) {
      const dataSource = ChartDataSources[selectedData.chartIndex];
      if (dataSource) {
        const virtualTableData = getVirtualTable(dataSource, dataSourceList);
        chartData = virtualTableData;
      }
    }

    const top5Charts = [
      ChartNameIndex.Top5UserVoiceFiles,
      ChartNameIndex.Top5UserSMSFiles,
      ChartNameIndex.Top5UserEmailFiles,
      ChartNameIndex.Top5UserFiles,
    ];

    if (top5Charts.includes(selectedData.chartIndex)) {
      // we dont want the startdate from the series for this
      selectedData.dateStart = undefined;
    }

    switch (selectedData.option) {
      case eChartMenuOption.showGrid:
        // apply data as filter
        {
          const chartComponent = _.cloneDeep(data);

          const chartFilter = getChartFilters(selectedData.chartIndex);
          if (top5Charts.includes(selectedData.chartIndex)) {
            if (selectedData.name === "ownerName") {
              selectedData.name = "owner";
            }
          }
          if (selectedData.name === "searchText") {
            chartData.searchText = selectedData.value;
          } else {
            let item = chartData.subItems.find(
              (x: any) => x.name === selectedData.name
            );
            if (item) {
              item.value = selectedData.value.trimEnd();
            }
            // if we have a start date - currently assuming thats obDateCreatedString
            if (selectedData.dateStart) {
              item = chartData.subItems.find(
                (x: any) => x.name === dateFieldName
              );
              if (item) {
                item.value = selectedData.dateStart;
              }
            }
          }
          // save the chart so can get back to it from grid
          chartData.backToChart = chartComponent;
          // convert the columns to localfilters & add to existing local filters
          chartData.localFilters = [
            ...(chartData?.localFilters || []),
            ...convertColsToLocalFilter(chartData.subItems),
            ...chartFilter,
          ];
          // copy any filters on the chart
          chartData.groupFilters = _.cloneDeep(data.groupFilters);
          updateData(chartData);
        }
        break;

      case eChartMenuOption.newGridView:
        {
          const newComponent = _.cloneDeep(chartData);
          let filter: AdvancedFilterModel | undefined = undefined;

          // clear the values in the columns so they dont appear in localfilters ( which adds them to columns )
          newComponent.subItems?.forEach((x: any) => delete x.value);

          // add all the columns to localFilters so appear in the new grid
          newComponent.localFilters = [
            ...newComponent.localFilters,
            ...convertColsToLocalFilter(newComponent.subItems),
          ];

          // copy any applied filters in the chart
          const appliedModels = data.groupFilters
            ? new Map(
                Object.entries(_.cloneDeep(data.groupFilters)).map((x) => [
                  Number(x[0]),
                  x[1] as AdvancedFilterModel,
                ])
              )
            : new Map<iTechDataWebFilterEnum, AdvancedFilterModel>();

          if (selectedData.name === "searchText") {
            newComponent.searchText = selectedData.value;
          } else {
            const filters = _.cloneDeep(newComponent.subItems);

            filter = buildFilterModel(
              filters,
              selectedData,
              dateFieldName,
              chartData
            );
            appliedModels.set(iTechDataWebFilterEnum.graph, filter);
            newComponent.groupFilters = Object.fromEntries(appliedModels);
          }

          trigger(AddTabWithGridEvent, {
            grid: newComponent,
            // graphFilters: filter, // we no longer pass these as filters to be dispatched to the store but as groupFilters persisted on the component
          });
        }
        break;

      case eChartMenuOption.filterCurrentTabGrids:
        // this must apply the current grid filter for the graph + the selected series filter just clicked on

        if (selectedData.name === "searchText") {
          // apply this as an event as transitory and want to be able to clear search text from grids
          trigger(AddSearchTextEvent, {
            searchText: selectedData.value,
            dataSource: ChartDataSources[selectedData.chartIndex],
          });
        } else {
          const filters = _.cloneDeep(chartData.subItems);

          const newFilter: AdvancedFilterModel = buildFilterModel(
            filters,
            selectedData,
            dateFieldName,
            chartData
          );

          dispatch(applyGraphFiltersAction(newFilter));
        }
        break;
    }
  };
  const _ops = (filter: any) =>
    Operations.find((op) => op.rowId === filter.iTechControlColumnTypeRowId);

  function convertColsToLocalFilter(cols: any[]): Filter[] {
    const filters: Filter[] = [];
    cols
      .filter((x: any) => !["checkbox", "select"].includes(x.name))
      .forEach((x: any) => {
        filters.push({
          value: x.value,
          name: x.name,
          operation: _ops(x)?.operations[0],
          iTechControlColumnTypeRowId: x.iTechControlColumnTypeRowId,
        } as Filter);
        delete x.value;
      });
    return filters;
  }

  const updateChartData = (newProps: any) => {
    updateData({ ...data, ...newProps });
  };

  const groupFilters = data?.groupFilters
    ? new Map(
        Object.entries(data.groupFilters).map((x) => [
          Number(x[0]),
          x[1] as AdvancedFilterModel,
        ])
      )
    : undefined;

  const getTitle = (i: number, isFiltered: boolean, data: any) => {
    if (data?.title) return data.title;
    return getNameByIndex(i, isFiltered);
  };

  const getFixedTitle = (title: string, data: any) => {
    if (data?.title) return data.title;
    return title;
  };

  return componentType === "Chart" ? (
    <ChartList
      data={data}
      updateData={updateData}
      isFiltered={isFiltered}
      caseId={caseId}
      dataSourceList={dataSourceList}
    />
  ) : componentType ===
    getNameByIndex(ChartNameIndex.CountOfFileTypes, isFiltered) ? (
    // <PieFileCount
    //   service={graphService.getFileTypeCount}
    //   title={getFixedTitle("Count by file type", data)}
    //   area={area}
    //   filterData={chartData}
    //   onChartMenuSelected={chartMenuSelected}
    //   chartIndex={ChartNameIndex.CountOfFileTypes}
    //   updateData={updateChartData}
    //   filterGroup={data?.filterGroupColor || ("" as FilterGroup)}
    //   groupFilters={groupFilters}
    // />
    <PieCount
      service={graphService.getColumnCount}
      title={getFixedTitle("Count by file type", data)}
      area={area}
      filterData={chartData}
      onChartMenuSelected={chartMenuSelected}
      chartIndex={ChartNameIndex.CountOfFileTypes}
      updateData={updateChartData}
      filterGroup={data?.filterGroupColor || ("" as FilterGroup)}
      groupFilters={groupFilters}
      columnName="fileTypeAbb"
    />
  ) : componentType ===
    getNameByIndex(ChartNameIndex.CountOfFileTypesByMonth, isFiltered) ? (
    <BarFileCountMonthly
      service={graphService.getFileTypesMonthlyCount}
      title={getFixedTitle("File type count / month", data)}
      area={area}
      filterData={chartData}
      onChartMenuSelected={chartMenuSelected}
      chartIndex={ChartNameIndex.CountOfFileTypesByMonth}
      updateData={updateChartData}
      filterGroup={data?.filterGroupColor || ("" as FilterGroup)}
      groupFilters={groupFilters}
    />
  ) : componentType ===
    getNameByIndex(ChartNameIndex.FilesCollectedDaily, isFiltered) ? (
    <LineCount
      service={graphService.getCountDaily}
      title={getFixedTitle("Files collected", data)}
      area={area}
      filterData={chartData}
      onChartMenuSelected={chartMenuSelected}
      chartIndex={ChartNameIndex.FilesCollectedDaily}
      updateData={updateChartData}
      filterGroup={data?.filterGroupColor || ("" as FilterGroup)}
      groupFilters={groupFilters}
      columnName="fileTypeAbb"
      dateColumn="obDateCreatedString"
    />
  ) : // collection total
  componentType ===
    getNameByIndex(ChartNameIndex.CollectionTotals, isFiltered) ? (
    <LineChartCollectionTotals
      service={graphService.getColumnCount}
      title={getFixedTitle("Collection Total", data)}
      area={area}
      filterData={chartData}
      onChartMenuSelected={chartMenuSelected}
      chartIndex={ChartNameIndex.CollectionTotals}
      updateData={updateChartData}
      filterGroup={data?.filterGroupColor || ("" as FilterGroup)}
      groupFilters={groupFilters}
      columnName="name"
    />
  ) : componentType ===
    getNameByIndex(
      ChartNameIndex.AuditAllUserActivityCategpryByMonth,
      isFiltered
    ) ? (
    <LineChartAllUserActivity
      service={graphService.getAllUserActivity}
      title={getFixedTitle("All user activity", data)}
      area={area}
      filterData={chartData}
      chartIndex={ChartNameIndex.AuditAllUserActivityCategpryByMonth}
      onChartMenuSelected={chartMenuSelected}
      updateData={updateChartData}
      filterGroup={data?.filterGroupColor || ("" as FilterGroup)}
      groupFilters={groupFilters}
    />
  ) : componentType ===
    getNameByIndex(ChartNameIndex.Top5UserVoiceFiles, isFiltered) ? (
    <Top5Chart
      service={graphService.getTop5VoiceFileCount}
      title={getTitle(ChartNameIndex.Top5UserVoiceFiles, isFiltered, data)}
      area={area}
      filterData={chartData}
      onChartMenuSelected={chartMenuSelected}
      chartIndex={ChartNameIndex.Top5UserVoiceFiles}
    />
  ) : componentType ===
    getNameByIndex(ChartNameIndex.Top5UserSMSFiles, isFiltered) ? (
    <Top5Chart
      service={graphService.getTop5SMSFileCount}
      title={getNameByIndex(ChartNameIndex.Top5UserSMSFiles, isFiltered)}
      area={area}
      filterData={chartData}
      onChartMenuSelected={chartMenuSelected}
      chartIndex={ChartNameIndex.Top5UserSMSFiles}
    />
  ) : componentType ===
    getNameByIndex(ChartNameIndex.Top5UserEmailFiles, isFiltered) ? (
    <Top5Chart
      service={graphService.getTop5EmailFileCount}
      title={getNameByIndex(ChartNameIndex.Top5UserEmailFiles, isFiltered)}
      area={area}
      filterData={chartData}
      onChartMenuSelected={chartMenuSelected}
      chartIndex={ChartNameIndex.Top5UserEmailFiles}
    />
  ) : componentType ===
    getNameByIndex(ChartNameIndex.Top5UserFiles, isFiltered) ? (
    <Top5BarChartFilter
      service={graphService.getTop5UserFiles}
      title={getTitle(ChartNameIndex.Top5UserFiles, isFiltered, data)}
      area={area}
      filterData={chartData}
      onChartMenuSelected={chartMenuSelected}
      chartIndex={ChartNameIndex.Top5UserFiles}
      updateData={updateChartData}
      filterGroup={data?.filterGroupColor || ("" as FilterGroup)}
      groupFilters={groupFilters}
    />
  ) : componentType === getNameByIndex(ChartNameIndex.WordCount, isFiltered) ? (
    <WordCloud
      service={graphService.getWordCount}
      title={Charts[ChartNameIndex.WordCount]}
      area={area}
      filterData={chartData}
      onChartMenuSelected={chartMenuSelected}
      chartIndex={ChartNameIndex.WordCount}
    />
  ) : componentType ===
    getNameByIndex(ChartNameIndex.StockChart, isFiltered) ? (
    // <StockChartDemo
    //   data={data}
    //   dataKey="key"
    //   dataValue={[]}
    //   area={area}
    //   chartIndex={ChartNameIndex.StockChart}
    //   seriesName=""
    // />
    <StockChartWithList
      listService={graphService.getStockList}
      service={graphService.getIntradayStock}
      area={area}
      updateData={updateChartData}
      selected={data?.selectedStock}
      range={{ min: data?.min, max: data?.max }}
      chartIndex={ChartNameIndex.StockChart}
    />
  ) : componentType ===
    getNameByIndex(ChartNameIndex.RealStockChart, isFiltered) ? (
    <StockChartWithList
      listService={graphService.getRimesStockList}
      service={graphService.getRimesStock}
      area={area}
      updateData={updateChartData}
      selected={data?.selectedStock}
      chartIndex={ChartNameIndex.RealStockChart}
    />
  ) : // <StockChart service={graphService.getStock} area={area} chartIndex={ChartNameIndex.StockChart} />
  componentType === getNameByIndex(ChartNameIndex.StockPrice, isFiltered) ? (
    <StockPriceChart
      service={graphService.getStockPrice}
      area={area}
      chartIndex={ChartNameIndex.StockPrice}
      series={["ask", "bid"]}
    />
  ) : componentType === getNameByIndex(ChartNameIndex.Timeline, isFiltered) ? (
    <TimeLine
      service={graphService.getTimeline}
      title={getTitle(ChartNameIndex.Timeline, isFiltered, data)}
      area={area}
      chartIndex={ChartNameIndex.Timeline}
      filterData={chartData}
      updateData={updateChartData}
      filterGroup={data?.filterGroupColor || ("" as FilterGroup)}
      groupFilters={groupFilters}
    />
  ) : componentType ===
    getNameByIndex(ChartNameIndex.CaseRelationships, isFiltered) ? (
    <CaseNetworkChart
      service={graphService.getCaseNetwork}
      area={area}
      chartIndex={ChartNameIndex.CaseRelationships}
      filterData={chartData}
    />
  ) : componentType ===
    getNameByIndex(ChartNameIndex.PersonRelationships, isFiltered) ? (
    <PersonNetworkChart
      service={graphService.getPersonNetwork}
      area={area}
      chartIndex={ChartNameIndex.PersonRelationships}
      filterData={chartData}
      title="Communications Relationships"
    />
  ) : componentType ===
    getNameByIndex(ChartNameIndex.CommsDependencyChart, isFiltered) ? (
    <DependencyChart
      title={getNameByIndex(ChartNameIndex.CommsDependencyChart, isFiltered)}
      service={graphService.getPersonNetwork}
      area={area}
      chartIndex={ChartNameIndex.CommsDependencyChart}
      filterData={chartData}
    />
  ) : componentType ===
    getNameByIndex(ChartNameIndex.CaseStatusCount, isFiltered) ? (
    <PieCount
      service={graphService.getColumnCount}
      title={getFixedTitle("Case Status", data)}
      area={area}
      filterData={chartData}
      onChartMenuSelected={chartMenuSelected}
      chartIndex={ChartNameIndex.CaseStatusCount}
      updateData={updateChartData}
      filterGroup={data?.filterGroupColor || ("" as FilterGroup)}
      groupFilters={groupFilters}
      columnName="caseStatusTypeAbb" // has to be the abb rather than the description for the filter
      intitalTimePeriod={TimePeriodEnum.lastMonth}
    />
  ) : componentType ===
    getNameByIndex(ChartNameIndex.BarCaseStatus, isFiltered) ? (
    <BarCount
      service={graphService.getColumnCount}
      title={getTitle(ChartNameIndex.BarCaseStatus, isFiltered, data)}
      area={area}
      filterData={chartData}
      onChartMenuSelected={chartMenuSelected}
      chartIndex={ChartNameIndex.BarCaseStatus}
      updateData={updateChartData}
      filterGroup={data?.filterGroupColor || ("" as FilterGroup)}
      groupFilters={groupFilters}
      columnName="caseStatusTypeAbb" // has to be the abb rather than the description for the filter
      intitalTimePeriod={TimePeriodEnum.lastMonth}
    />
  ) : componentType ===
    getNameByIndex(ChartNameIndex.PieCaseStatusLevel1, isFiltered) ? (
    <PieCaseStatus
      service={graphService.getCaseLevel1Count}
      area={area}
      filterData={chartData}
      onChartMenuSelected={chartMenuSelected}
      chartIndex={ChartNameIndex.PieCaseStatusLevel1}
      title={getTitle(ChartNameIndex.PieCaseStatusLevel1, isFiltered, data)}
      updateData={updateChartData}
      filterGroup={data?.filterGroupColor || ("" as FilterGroup)}
      groupFilters={groupFilters}
    />
  ) : componentType ===
    getNameByIndex(ChartNameIndex.PieCaseStatusLevel2, isFiltered) ? (
    <PieCaseStatus
      service={graphService.getCaseLevel2Count}
      area={area}
      filterData={chartData}
      onChartMenuSelected={chartMenuSelected}
      chartIndex={ChartNameIndex.PieCaseStatusLevel2}
      title={getTitle(ChartNameIndex.PieCaseStatusLevel2, isFiltered, data)}
      updateData={updateChartData}
      filterGroup={data?.filterGroupColor || ("" as FilterGroup)}
      groupFilters={groupFilters}
    />
  ) : componentType ===
    getNameByIndex(ChartNameIndex.PieCaseStatusLevel3, isFiltered) ? (
    <PieCaseStatus
      service={graphService.getCaseLevel3Count}
      area={area}
      filterData={chartData}
      onChartMenuSelected={chartMenuSelected}
      chartIndex={ChartNameIndex.PieCaseStatusLevel3}
      title={getTitle(ChartNameIndex.PieCaseStatusLevel3, isFiltered, data)}
      updateData={updateChartData}
      filterGroup={data?.filterGroupColor || ("" as FilterGroup)}
      groupFilters={groupFilters}
    />
  ) : componentType ===
    getNameByIndex(ChartNameIndex.CaseStatusCountByDay, isFiltered) ? (
    <BarCaseStatusDaily
      service={graphService.getCaseStatusCountDaily}
      area={area}
      filterData={chartData}
      onChartMenuSelected={chartMenuSelected}
      chartIndex={ChartNameIndex.CaseStatusCountByDay}
    />
  ) : componentType ===
    getNameByIndex(ChartNameIndex.CaseOpenSubtypeCountByDay, isFiltered) ? (
    <BarOpenCaseSubtypeDaily
      service={graphService.getCaseSubTypeByDay}
      area={area}
      filterData={chartData}
      onChartMenuSelected={chartMenuSelected}
      chartIndex={ChartNameIndex.CaseOpenSubtypeCountByDay}
    />
  ) : componentType ===
    getNameByIndex(ChartNameIndex.CaseAllSubtypeCountByDay, isFiltered) ? (
    <BarCaseSubtypeDaily
      service={graphService.getAllCaseSubTypeByDay}
      area={area}
      filterData={chartData}
      onChartMenuSelected={chartMenuSelected}
      chartIndex={ChartNameIndex.CaseAllSubtypeCountByDay}
    />
  ) : componentType ===
    getNameByIndex(ChartNameIndex.CaseTaskGantt, isFiltered) ? (
    <CaseTaskGantt
      service={graphService.getCaseTasks}
      area={area}
      chartIndex={ChartNameIndex.CaseTaskGantt}
      filterData={chartData}
      title={getNameByIndex(ChartNameIndex.CaseTaskGantt, isFiltered)}
    />
  ) : componentType ===
    getNameByIndex(ChartNameIndex.TaskOutcome, isFiltered) ? (
    <PieTaskOutcome
      service={graphService.getCaseTaskOutcomeCount}
      area={area}
      filterData={chartData}
      onChartMenuSelected={chartMenuSelected}
      chartIndex={ChartNameIndex.TaskOutcome}
    />
  ) : componentType ===
    getNameByIndex(ChartNameIndex.TaskStatus, isFiltered) ? (
    <PieTaskStatus
      service={graphService.getCaseTaskStatusCount}
      area={area}
      filterData={chartData}
      onChartMenuSelected={chartMenuSelected}
      chartIndex={ChartNameIndex.TaskStatus}
    />
  ) : componentType ===
    getNameByIndex(ChartNameIndex.CaseRiskLevel, isFiltered) ? (
    <BarCount
      service={graphService.getCaseRiskCount}
      area={area}
      filterData={chartData}
      onChartMenuSelected={chartMenuSelected}
      chartIndex={ChartNameIndex.CaseRiskLevel}
      title={getNameByIndex(ChartNameIndex.CaseRiskLevel, isFiltered)}
      colors={caseRiskColors}
      updateData={updateChartData}
      filterGroup={data?.filterGroupColor || ("" as FilterGroup)}
      groupFilters={groupFilters}
    />
  ) : componentType ===
    getNameByIndex(ChartNameIndex.DemoTop50Phrases, isFiltered) ? (
    <WordCloudDemo
      service={graphService.getWordCount}
      title="Top 50 Phrases"
      area={area}
      filterData={chartData}
      onChartMenuSelected={chartMenuSelected}
      chartIndex={ChartNameIndex.DemoTop50Phrases}
    />
  ) : componentType ===
    getNameByIndex(ChartNameIndex.Maps, isFiltered) ? (
    <DemoWorldMaps
    service={graphService.getColumnCount}
      title="World Maps"
      area={area}
      filterData={chartData}
      onChartMenuSelected={chartMenuSelected}
      chartIndex={ChartNameIndex.DemoTop50Phrases}
    />
  ) : componentType ===
    getNameByIndex(ChartNameIndex.DemoTriggeredKeywords, isFiltered) ? (
    <DemoTriggeredKeywordsChart
      service={graphService.getTop5EmailFileCount}
      title="Triggered Keywords"
      area={area}
      filterData={chartData}
      onChartMenuSelected={chartMenuSelected}
      chartIndex={ChartNameIndex.Top5UserEmailFiles}
    />
  ) : componentType ===
    getNameByIndex(ChartNameIndex.DemoCaseStatusPie, isFiltered) ? (
    <DemoPieCaseStatus
      service={graphService.getCaseStatusCount}
      area={area}
      filterData={chartData}
      onChartMenuSelected={chartMenuSelected}
      chartIndex={ChartNameIndex.DemoCaseStatusPie}
    />
  ) : componentType ===
    getNameByIndex(ChartNameIndex.DemoTriggersDaily, isFiltered) ? (
    <DemoBarDailyTriggers
      service={graphService.getCaseSubTypeByDay}
      area={area}
      filterData={chartData}
      onChartMenuSelected={chartMenuSelected}
      chartIndex={ChartNameIndex.DemoTriggersDaily}
    />
  ) : componentType ===
    getNameByIndex(ChartNameIndex.StatusOfCollectorHost, isFiltered) ? (
    <PieCount
      service={graphService.getColumnCount}
      title={getFixedTitle("Status Of Host", data)}
      area={area}
      filterData={chartData}
      onChartMenuSelected={chartMenuSelected}
      chartIndex={ChartNameIndex.StatusOfCollectorHost}
      updateData={updateChartData}
      filterGroup={data?.filterGroupColor || ("" as FilterGroup)}
      groupFilters={groupFilters}
      columnName="status"
      fixedFilters={[
        {
          name: "iTechDataManageEntityTypeRowId", 
          value: "14",
          operation: "equals",
          iTechControlColumnType: iTechControlColumnEnum.string,
          iTechControlColumnTypeRowId: 9,
          rowId: 0,
          filters: [],
          isLogin: false,
        },
        {
          name: "IsMonitoredEditable", 
          value: "true",
          operation: "equals",
          iTechControlColumnType: iTechControlColumnEnum.string,
          iTechControlColumnTypeRowId: 9,
          rowId: 0,
          filters: [],
          isLogin: false,
        },
      ]}
    />
    ) : componentType ===
    getNameByIndex(ChartNameIndex.StatusOfCollectorCollector, isFiltered) ? (
    <PieCount
      service={graphService.getColumnCount}
      title={getFixedTitle("Status Of Collector", data)}
      area={area}
      filterData={chartData}
      onChartMenuSelected={chartMenuSelected}
      chartIndex={ChartNameIndex.StatusOfCollectorCollector}
      updateData={updateChartData}
      filterGroup={data?.filterGroupColor || ("" as FilterGroup)}
      groupFilters={groupFilters}
      columnName="status"
      fixedFilters={[
        {
          name: "iTechDataManageEntityTypeRowId", 
          value: "47",
          operation: "equals",
          iTechControlColumnType: iTechControlColumnEnum.string,
          iTechControlColumnTypeRowId: 9,
          rowId: 0,
          filters: [],
          isLogin: false,
        },
        {
          name: "IsMonitoredEditable", 
          value: "true",
          operation: "equals",
          iTechControlColumnType: iTechControlColumnEnum.string,
          iTechControlColumnTypeRowId: 9,
          rowId: 0,
          filters: [],
          isLogin: false,
        },
      ]}
    />
    ) : componentType ===
    getNameByIndex(ChartNameIndex.StatusOfCollectorInline, isFiltered) ? (
    <PieCount
      service={graphService.getColumnCount}
      title={getFixedTitle("Status Of Inline", data)}
      area={area}
      filterData={chartData}
      onChartMenuSelected={chartMenuSelected}
      chartIndex={ChartNameIndex.StatusOfCollectorInline}
      updateData={updateChartData}
      filterGroup={data?.filterGroupColor || ("" as FilterGroup)}
      groupFilters={groupFilters}
      columnName="status"
      fixedFilters={[
        {
          name: "objectId", 
          value: "1003",
          operation: "contains",
          iTechControlColumnType: iTechControlColumnEnum.string,
          iTechControlColumnTypeRowId: 9,
          rowId: 0,
          filters: [],
          isLogin: false,
        },
        {
          name: "abbPrint", 
          value: "soteriaInlinemonitor",
          operation: "contains",
          iTechControlColumnType: iTechControlColumnEnum.string,
          iTechControlColumnTypeRowId: 9,
          rowId: 0,
          filters: [],
          isLogin: false,
        },
      ]}
    />
    ) : componentType ===
    getNameByIndex(ChartNameIndex.StatusOfCollectorOnsite, isFiltered) ? (
    <PieCount
      service={graphService.getColumnCount}
      title={getFixedTitle("Status Of Onsite / Edge", data)}
      area={area}
      filterData={chartData}
      onChartMenuSelected={chartMenuSelected}
      chartIndex={ChartNameIndex.StatusOfCollectorOnsite}
      updateData={updateChartData}
      filterGroup={data?.filterGroupColor || ("" as FilterGroup)}
      groupFilters={groupFilters}
      columnName="status"
      fixedFilters={[
        {
          name: "abbPrint", 
          value: "onsiteEdgeDevice",
          operation: "contains",
          iTechControlColumnType: iTechControlColumnEnum.string,
          iTechControlColumnTypeRowId: 9,
          rowId: 0,
          filters: [],
          isLogin: false,
        },
      ]}
    />
  ) : (
    <div>Unknown chart type </div>
  );
};

export default ChartWizard;


