import _ from "lodash";
import { ComponentType } from "../ComponentDisplay/componentType";
import { ITechControlTable } from "../Model/iTechRestApi/ITechControlTable";
import { IFilterData } from "../_services/graphService";
import { Immutable } from "../_context/selectors/useSelectors";
import { iTechControlColumnEnum } from "../Model/iTechRestApi/iTechControlColumnEnum";
import { Filter } from "../Model/iTechRestApi/Filter";
import { DataSource } from "../Model/iTechRestApi/DataSource";
import { FilterGroup } from "../Model/Types/FilterGroup";
import { iTechDataWebFilterEnum } from "../Model/iTechRestApi/iTechDataWebFilterEnum";
import { AdvancedFilterModel } from "../Model/iTechRestApi/AdvancedFilterModel";
import { ColumnCount } from "../Model/iTechRestApi/FileCount";
import { TimePeriodEnum } from "../Model/iTechRestApi/TimePeriodEnum";
import { FilesPerDay } from "../Model/iTechRestApi/FilesPerDay";

export enum eChartMenuOption {
  newGridView = 1,
  filterCurrentTabGrids = 2,
  showGrid = 3,
  open = 4,
  openFullScreen = 5,
  openInNewTab = 6,
}

export interface IChartSeries {
  option?: eChartMenuOption;
  name: string;
  value: string;
  dateStart?: string; // TODO - name for date col as another prop ?
  dateEnd?: string;
  chartIndex: ChartNameIndex;
}

export enum ChartNameIndex {
  Chart = 0,
  CountOfFileTypes = 1,
  CountOfFileTypesByMonth = 2,
  FilesCollectedDaily = 3,
  AuditAllUserActivityCategpryByMonth = 4,
  StockChart = 5,
  Top5UserVoiceFiles = 6,
  Top5UserSMSFiles = 7,
  Top5UserEmailFiles = 8,
  WordCount = 9,
  RealStockChart = 10,
  StockPrice = 11,
  Timeline = 12,
  CaseRelationships = 13,
  CaseStatusCount = 14,
  CaseStatusCountByDay = 15,
  CaseOpenSubtypeCountByDay = 16,
  CaseAllSubtypeCountByDay = 17,
  CaseTaskGantt = 18,
  TaskOutcome = 19,
  TaskStatus = 20,
  DemoTriggeredKeywords,
  DemoTop50Phrases,
  DemoCaseStatusPie,
  DemoTriggersDaily,
  Top5UserFiles,
  BarCaseStatus,
  PieCaseStatusLevel1,
  PieCaseStatusLevel2,
  PieCaseStatusLevel3,
  CaseRiskLevel,
  PersonRelationships,
  CommsDependencyChart,
  StatusOfCollectorHost = 33,
  StatusOfCollectorCollector = 34,
  StatusOfCollectorInline = 35,
  StatusOfCollectorOnsite = 36,
  CollectionTotals = 37,
  AssureComplainceStatus = 38,
  AssureLineStatus = 39,
  Maps=40
}

// order matches ChartNameIndex
// N.B. names must be unique as used in lookups as componentType value
export const Charts = [
  "Chart",
  "Count of File Types",
  "Count of File Types by Month",
  "Files Collected Daily",
  "Audit all user activity category by Month",
  "Stock News Chart",
  "Top 5 user voice files in last 6 mths",
  "Top 5 user sms files in last 6 mths",
  "Top 5 user email files in last 6 mths",
  "Top 100 Words",
  "Stock Chart",
  "Stock Price",
  "Timeline",
  "Case Relationships",
  "Case Status for last 31 days",
  "Case Status daily for last 31 days", // 15
  "Case (open) Subtype daily for last 31 days",
  "Case (all) Subtype daily for last 31 days",
  "Workflow",
  "Task outcome",
  "Task status", // 20
  "Triggered Keywords", // DEMO
  "Top 50 Phrases", // DEMO
  "Case Status", // DEMO
  "Trigger Words by Day", // DEMO
  "Top 5 user files",
  "Case Status", // Bar chart
  "Open Events L1",
  "Open Alerts L2",
  "Open Cases L3",
  "Event Risk",
  "Person Relationships",
  "Communications Dependency",
  "Status Of Host",
  "Status Of Collector",
  "Status Of Inline",
  "Status Of Onsite / Edge",
  "Collection Totals",
  "Assure Compliance Status",
  "Assure Line Status",
  "Maps"
];

// order matches ChartNameIndex
export const ChartDataSources = [
  "", // blank as not an actual chart entry
  "iTechWebSim",
  "iTechWebSim",
  "iTechWebSim",
  "iTechWebAudit",
  "iTechWebStockOrder", // stock news chart ( from StockContext ).. using any datasource that is specific to this DB context here..
  "iTechWebSim",
  "iTechWebSim",
  "iTechWebSim",
  "iTechWebSim",
  "iTechStockQuote", // stock chart... ( any ds from TradStockContext )
  "iTechStockQuote", // stock price.. ( any ds from TradStockContext )
  "iTechWebSim",
  "iTechWebSim",
  "iTechWebCaseManagement", // TODO for case?
  "iTechWebCaseManagement", // 15 // TODO for case?
  "iTechWebCaseManagement", // TODO for case?
  "iTechWebCaseManagement", // TODO for case?
  "iTechWebTask",
  "iTechWebTask",
  "iTechWebTask",
  // DEMO x 4
  "",
  "",
  "",
  "",
  "iTechWebSim",
  "iTechWebCaseManagement",
  "iTechWebCaseManagement",
  "iTechWebCaseManagement",
  "iTechWebCaseManagement",
  "iTechWebCaseManagement",
  "iTechWebSim",
  "iTechWebSim",
  "iTechWebManageEntity",
  "iTechWebManageEntity",
  "iTechWebManageEntity",
  "iTechWebManageEntity",
  "iTechWebCollectionTotals",
  "iTechWebReportingAssure",
  "iTechWebReportingAssure",
  "",
];

export const ReverseSortCharts = ["iTechWebCaseManagement"];

export interface IFilteredChartProps {
  service:
    | ((filter?: IFilterData) => any)
    | ((filter?: IFilterData, dataSource?: string, columnName?: string) => ColumnCount)
    | ((
        filter?: IFilterData,
        dataSource?: string,
        columnName?: string,
        dateColumn?: string
      ) => FilesPerDay); // added new signatures for more generic chart apis
  area: string;
  filterData?: IFilterData;
  title?: string;
  onChartMenuSelected?(data: IChartSeries): void;
  chartIndex: ChartNameIndex;
  updateData?: (data?: any) => void;
  colors?: Array<string>;
  filterGroup?: FilterGroup;
  groupFilters?: Map<iTechDataWebFilterEnum, AdvancedFilterModel>;
  columnName?: string;
  intitalTimePeriod?: TimePeriodEnum; // optional default initial value for the timeperiod
  fixedFilters?: Filter[]; // optional - any fixed filters for the chart service call
  dateColumn?: string; // the string version in db - i.e. obDateCreatedString 
  hideTimePeriod?:boolean;    
}

const unfilteredNamePostfix = " in"; // simplistic title amendment when filtered data

export const isChart = (componentType: string, ignoreChart = false): boolean =>
  chartIndex(getName(componentType, true), true) > (ignoreChart ? 0 : -1); // ignores first entry "Chart"

const chartIndex = (componentType: string, filteredData: boolean): number =>
  filteredData ? getNamesForFilteredData().indexOf(componentType) : Charts.indexOf(componentType);

const getNamesForFilteredData = (): string[] => Charts.map((x: string) => getName(x, true));

export const getNameByIndex = (i: number, isFiltered: boolean): string =>
  getName(Charts[i], isFiltered);

const getName = (name: string, isFiltered = false): string => {
  if (name && isFiltered) {
    const i = name.indexOf(unfilteredNamePostfix);
    if (i >= 0) {
      return name.substring(0, i);
    }
  }
  return name;
};

// called with the result of tableService.getAll()- filtered where name === dataSoruce
const createVirtualTableData = (data: any) => {
  if (!data) return;
  data.componentType = ComponentType.VirtualTable;
  data.subItems = data.iTechControlColumns.filter(
    (i: any) => i.gridIndex !== null && i.gridSelected
  );
  data.subItems.map((i: any, index: number) => {
    i.id = `${i.rowId}-child`;
    i.index = index;
    i.checked = i.gridSelected;
    return i;
  });
  delete data.iTechControlColumns;
  data.subItems.map((s: any, index: number) => {
    delete s.types;
    s.index = index;
    return s;
  });
  data.subItems.sort((a: any, b: any) => a.gridIndex - b.gridIndex);
};

export const getVirtualTable = (
  dataSource: string,
  dataSourceList: ReadonlyArray<Immutable<ITechControlTable>>
): ITechControlTable | undefined => {
  // new object so we dont modify store instance
  const data = _.cloneDeep(dataSourceList.find((x: any) => x.name === dataSource));
  createVirtualTableData(data);
  return data as ITechControlTable;
};

export function AddTimePeriodFilter(
  timePeriod: number,
  filterData: IFilterData | undefined,
  columnName: string | undefined
): void {
  if (!columnName) return;
  const timePeriodFilter = {
    value: timePeriod === 0 ? "" : timePeriod,
    name: columnName,
    operation: "After",
    iTechControlColumnTypeRowId: iTechControlColumnEnum.dateTime,
  } as Filter;

  if (filterData) {
    if (filterData?.localFilters) {
      filterData.localFilters = [
        ...filterData.localFilters.filter((x) => x.name !== timePeriodFilter.name),
        timePeriodFilter,
      ];
    } else {
      filterData.localFilters = [timePeriodFilter];
    }
  }
}

// convert to just the datasources[]
export const MapToDatasource = (
  models?: Map<iTechDataWebFilterEnum, AdvancedFilterModel>
): DataSource[] | undefined => {
  if (!models || !models.keys) return undefined;
  const ds: DataSource[] = [];

  Array.from(models.keys()).forEach((k) => {
    const modelDataSources = models.get(k)?.dataSources;
    if (modelDataSources) {
      modelDataSources.forEach((s) => ds.push(s));
    }
  });
  return ds;
};

// add any applied filters for this datasource into the chart filter
// filterData - any current graph filter
// returns a new instance of filterData if amended so we dont keep adding same filters over and over & persisting in the chart
export function ApplyFilters(
  dataSource: string,
  filterData?: IFilterData,
  appliedFilters?: DataSource[]
): IFilterData | undefined {
  if (!appliedFilters && filterData) {
    filterData.groupFilters = undefined;
    return filterData;
  }
  const flatDs: DataSource[] = [];

  // flatten any nested tree filters...
  appliedFilters?.forEach((v) => {
    v.filters.forEach((filter: any) => {
      if (filter.filters?.length) {
        flatDs.push({
          filters: filter.filters,
          rule: filter.rule,
          name: dataSource,
          rowId: 0,
          id: 0,
        });
      } else {
        flatDs.push({ rule: filter.rule, filters: [filter], name: dataSource, id: 0, rowId: 0 });
      }
    });
  });

  if (flatDs && flatDs.length) {
    if (!filterData) {
      filterData = { subItems: [], localFilters: [] };
    }
    filterData.groupFilters = flatDs;
  }
  return filterData;
}

export function getDefaultTimePeriod(
  filterData: IFilterData | undefined,
  columnName: string | undefined,
  intitalTimePeriod?: TimePeriodEnum
): number {
  const val = filterData?.localFilters?.find((x) => x.name === columnName)?.value;
  if (val === undefined && columnName !== undefined) {
    return intitalTimePeriod || 0;
  }
  return val;
}
