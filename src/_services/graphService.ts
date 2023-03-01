import config from "../config";
import { RowData } from "../Model/iTechRestApi/AdvancedGrid";
import { CaseStatusCount } from "../Model/iTechRestApi/CaseStatusCount";
import { CaseStatusCountByDay } from "../Model/iTechRestApi/CaseStatusCountByDay";
import { CaseTask } from "../Model/iTechRestApi/CaseTask";
import { Expression } from "../Model/iTechRestApi/Expression";
import { ColumnCount } from "../Model/iTechRestApi/FileCount";
import { FileCountMonthly } from "../Model/iTechRestApi/FileCountMonthly";
import { FilesPerDay } from "../Model/iTechRestApi/FilesPerDay";
import { NamedCount } from "../Model/iTechRestApi/NamedCount";
import { NetworkNode } from "../Model/iTechRestApi/NetworkNode";
// import { StockCandleStick } from "../Model/iTechRestApi/StockCandleStick";
import { StockData, StockDataBoost } from "../Model/iTechRestApi/StockData";
import { StockItem } from "../Model/iTechRestApi/StockItem";
import { TaskCount } from "../Model/iTechRestApi/TaskCount";
import { TimelineData } from "../Model/iTechRestApi/TimelineData";
import { TotalsSelection } from "../Model/iTechRestApi/TotalsSelection";
import { WordCount } from "../Model/iTechRestApi/WordCount";
import { authHeader } from "../_helpers/authHeader";
import { handleResponse } from "../_helpers/handleResponse";
import { dataService } from "./dataService";

export interface IFilterData {
  searchText?: string;
  subItems: any[];
  localFilters: any[];
  groupFilters?: Expression[];
  signal?: AbortSignal;
  value?: any;
}

export const graphService = {
  getColumnCount,
  getCountDaily,
  // getFileTypeCount,
  getFileTypesMonthlyCount,
  getWordCount,
  getAllUserActivity,
  getTop5SMSFileCount,
  getTop5VoiceFileCount,
  getTop5EmailFileCount,
  getTop5UserFiles,
  getSeries,
  getTable,
  getStock,
  getStockPrice,

  getRimesStock,
  getRimesStockList,
  getTimeline,
  getCaseNetwork,

  // case specific charts
  getCaseStatusCount,
  getCaseStatusCountDaily,
  getCaseSubTypeByDay,
  getAllCaseSubTypeByDay,

  getCaseTasks,

  getCaseTaskOutcomeCount,
  getCaseTaskStatusCount,
  getCaseLevel1Count,
  getCaseLevel2Count,
  getCaseLevel3Count,
  getCaseRiskCount,
  getPersonNetwork,

  getIntradayStock,
  getStockList,
  getCollectionLists,
  getSimpleTable,
};

async function getCountDaily(
  filterData?: IFilterData,
  dataSource?: string,
  columnName?: string,
  dateColumn?: string
): Promise<FilesPerDay[]> {
  return getFilteredGraph("ColumnCountDaily", filterData, dataSource, columnName, dateColumn);
}

async function getTimeline(filterData?: IFilterData): Promise<TimelineData[]> {
  return getFilteredGraph("Timeline", filterData);
}

async function getWordCount(): Promise<WordCount[]> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return await fetch(`${config.apiUrl}/api/iTechGraph/WordUsage`, requestOptions).then(
    handleResponse
  );
}

async function getAllUserActivity(filterData?: IFilterData): Promise<FileCountMonthly[]> {
  return getFilteredGraph("AllUserActivity", filterData);
}

async function getTop5SMSFileCount(filterData?: IFilterData): Promise<NamedCount[]> {
  return getFilteredGraph("Top5User/1", filterData);
}

async function getTop5VoiceFileCount(filterData?: IFilterData): Promise<NamedCount[]> {
  return getFilteredGraph("Top5User/2", filterData);
}

async function getTop5EmailFileCount(filterData?: IFilterData): Promise<NamedCount[]> {
  return getFilteredGraph("Top5User/3", filterData);
}

// replacement for the 3 charts above
async function getTop5UserFiles(filterData?: IFilterData): Promise<NamedCount[]> {
  return getFilteredGraph("Top5UserFiles", filterData);
}

async function getSeries(search: string, column: string, expressions: any[]): Promise<any> {
  const express = dataService.convertDurationExpression(expressions);
  const requestOptions = {
    method: "POST",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(express),
  };

  return await fetch(
    `${config.apiUrl}/api/iTechGraph/series?search=${search}&column=${column}`,
    requestOptions
  ).then(handleResponse);
}

async function getTable(search: string, column: string, expressions: any[]): Promise<any> {
  const express = dataService.convertDurationExpression(expressions);
  const requestOptions = {
    method: "POST",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(express),
  };

  return await fetch(
    `${config.apiUrl}/api/iTechGraph/table?search=${search}&column=${column}`,
    requestOptions
  ).then(handleResponse);
}

// async function getFileTypeCount(filterData?: IFilterData): Promise<FileCount[]> {
//   return getFilteredGraph("FileTypeCount", filterData);
// }

async function getColumnCount(
  filterData?: IFilterData,
  dataSource?: string,
  columnName?: string
): Promise<ColumnCount[]> {
  return getFilteredGraph("ColumnCount", filterData, dataSource, columnName);
}

async function getFileTypesMonthlyCount(filterData?: IFilterData): Promise<FileCountMonthly[]> {
  return getFilteredGraph("FileTypesMonthlyCount", filterData);
}

async function getCaseNetwork(filterData?: IFilterData): Promise<NetworkNode[]> {
  return getFilteredGraph("Network", filterData);
}

async function getPersonNetwork(filterData?: IFilterData): Promise<NetworkNode[]> {
  const action = `PersonNetwork/${filterData?.value}`;
  return getFilteredGraph(action, filterData);
}

async function getCaseStatusCount(filterData?: IFilterData): Promise<CaseStatusCount[]> {
  const noOfDays = 31;

  return getFilteredGraph(`CaseStatusCount/${noOfDays}`, filterData);
}

async function getCaseStatusCountDaily(filterData?: IFilterData): Promise<CaseStatusCountByDay[]> {
  const noOfDays = 31;

  return getFilteredGraph(`CaseStatusByDay/${noOfDays}`, filterData);
}

async function getCaseSubTypeByDay(filterData?: IFilterData): Promise<CaseStatusCountByDay[]> {
  const noOfDays = 31;

  return getFilteredGraph(`CaseSubTypeByDay/${noOfDays}`, filterData);
}

async function getAllCaseSubTypeByDay(filterData?: IFilterData): Promise<CaseStatusCountByDay[]> {
  const noOfDays = 31;

  return getFilteredGraph(`CaseAllSubTypeByDay/${noOfDays}`, filterData);
}

async function getCaseTasks(id: number, filterData?: IFilterData): Promise<CaseTask[]> {
  // const requestOptions = { method: "GET", headers: authHeader() };
  // return await fetch(
  //     `${config.apiUrl}/api/iTechGraph/CaseTasks/${id}`,
  //     requestOptions
  // ).then(handleResponse);

  return getFilteredGraph(`CaseTasks/${id}`, filterData);
}

async function getCaseTaskOutcomeCount(filterData?: IFilterData): Promise<TaskCount[]> {
  return getFilteredGraph(`CaseTaskOutcomeCount`, filterData);
}

async function getCaseTaskStatusCount(filterData?: IFilterData): Promise<TaskCount[]> {
  return getFilteredGraph(`CaseTaskStatusCount`, filterData);
}

async function getFilteredGraph(
  action: string,
  filterData?: IFilterData,
  controller = "iTechGraph",
  column = "",
  groupColumn = ""
): Promise<any> {
  const url = new URL(`${config.apiUrl}/api/${controller}/${action}`);
  const requestOptions: RequestInit = {
    method: "GET",
    headers: authHeader({ "Content-Type": "application/json" }),
    signal: filterData?.signal,
  };
  if (column) {
    url.searchParams.append("column", column);
  }
  if (groupColumn) {
    url.searchParams.append("groupColumn", groupColumn);
  }

  if (filterData && (filterData.localFilters || filterData.groupFilters)) {
    let expressions = getExpressions(filterData.localFilters);
    if (filterData.groupFilters) {
      expressions = expressions.concat(filterData.groupFilters);
    }

    // cut filters down to just the actual data
    // expressions.forEach((element: any) => {
    //     element.filters = element.map((x: any) => { return { rowId: x.rowId, name: x.name, operation: x.operation, value: x.value, iTechControlColumnTypeRowId: x.iTechControlColumnTypeRowId } as Filter });
    // });

    // see: https://docs.microsoft.com/en-us/dotnet/api/system.web.configuration.httpruntimesection.maxquerystringlength?view=netframework-4.8&viewFallbackFrom=netcore-3.1
    const maxQueryStringLength = 4000; // CORS default limit in aspnet core
    const maxRequestLen = maxQueryStringLength - url.toString().length;
    const expressionsJson = JSON.stringify(expressions);
    url.searchParams.append("search", filterData.searchText || "");
    url.searchParams.append("expressions", expressionsJson);

    // switch to POST if params too long
    if (url.searchParams.toString().length > maxRequestLen) {
      url.searchParams.delete("expressions");
      requestOptions.method = "POST";
      requestOptions.body = expressionsJson;
    }
  }

  return await fetch(url.href, requestOptions).then(handleResponse);
}

async function getStock(isin: string): Promise<any> {
  const url = new URL(`${config.apiUrl}/api/iTechGraph/Stock`);
  const requestOptions = {
    method: "POST",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(isin),
  };

  return await fetch(url.href, requestOptions).then(handleResponse);
}

async function getStockPrice(ticker: string, grouping: number): Promise<any> {
  const url = new URL(`${config.apiUrl}/api/iTechGraph/StockPrice/${ticker}/${grouping}`);
  const requestOptions = {
    method: "GET",
    headers: authHeader({ "Content-Type": "application/json" }),
  };

  return await fetch(url.href, requestOptions).then(handleResponse);
}

async function getRimesStock(symbol: string): Promise<StockData> {
  const url = new URL(`${config.apiUrl}/api/iTechGraphStock/Stock/${symbol}`);
  const requestOptions = { method: "GET", headers: authHeader() };

  return await fetch(url.href, requestOptions).then(handleResponse);
}

async function getStockList(): Promise<StockItem[]> {
  // this uses a different context in the controller.
  const url = new URL(`${config.apiUrl}/api/iTechGraphStockContext/StockList`);
  const requestOptions = { method: "GET", headers: authHeader() };

  return await fetch(url.href, requestOptions).then(handleResponse);
}

async function getCollectionLists(): Promise<TotalsSelection> {
  // this uses a different context in the controller.
  const url = new URL(`${config.apiUrl}/api/iTechWebCollectionTotals/Lists`);
  const requestOptions = { method: "GET", headers: authHeader() };

  return await fetch(url.href, requestOptions).then(handleResponse);
}

async function getSimpleTable(): Promise<RowData> {
  // this uses a different context in the controller.
  const url = new URL(`${config.apiUrl}/api/iTechWebCollectionTotals/Lists`);
  const requestOptions = { method: "GET", headers: authHeader() };

  return await fetch(url.href, requestOptions).then(handleResponse);
}

async function getIntradayStock(symbol: string): Promise<StockDataBoost> {
  // this uses a different context in the controller.
  const url = new URL(`${config.apiUrl}/api/iTechGraphStockContext/Stock/${symbol}`);
  const requestOptions = { method: "GET", headers: authHeader() };

  return await fetch(url.href, requestOptions).then(handleResponse);
}

async function getRimesStockList(): Promise<StockItem[]> {
  const url = new URL(`${config.apiUrl}/api/iTechGraphStock/StockList`);
  const requestOptions = { method: "GET", headers: authHeader() };

  return await fetch(url.href, requestOptions).then(handleResponse);
}

// define these as 3 separate exposed service as no simple way in charts to pass other params easily at the moment
async function getCaseLevel1Count(filterData?: IFilterData): Promise<CaseStatusCount[]> {
  return getCaseLevelCount(1, filterData);
}
async function getCaseLevel2Count(filterData?: IFilterData): Promise<CaseStatusCount[]> {
  return getCaseLevelCount(2, filterData);
}
async function getCaseLevel3Count(filterData?: IFilterData): Promise<CaseStatusCount[]> {
  return getCaseLevelCount(3, filterData);
}

async function getCaseLevelCount(
  level: number,
  filterData?: IFilterData
): Promise<CaseStatusCount[]> {
  return getFilteredGraph(`CaseLevelCount/${level}`, filterData);
}

// uses CaseStatusCount - casestatus is actually the risk description
async function getCaseRiskCount(filterData?: IFilterData): Promise<CaseStatusCount[]> {
  return getFilteredGraph("CaseRiskCount", filterData);
}

const getExpressions = (items: any[]) => {
  const exp = items
    .filter((x: any) => x.name !== "checkbox")
    .map((c: any) => ({ rule: "AND", filters: [c] }));

  return dataService.convertDurationExpression(exp);
};
