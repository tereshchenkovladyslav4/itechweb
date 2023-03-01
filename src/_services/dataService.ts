import config from "../config";
import { authHeader } from "../_helpers/authHeader";
import { handleFileDownload, handleResponse } from "../_helpers/handleResponse";
import { QuerySet } from "../Model/Types/QuerySet";
import { parseTimeRangeToMs, convertMstoTime } from "../_helpers/durationConverter";
import { ICaseFilter } from "../Model/iTechRestApi/ICaseData";
import { iTechControlCaseFileStatusEnum } from "../Model/iTechRestApi/iTechControlCaseFileStatusEnum";
import { iTechControlTableReferenceEnum } from "../Model/iTechRestApi/iTechControlTableReferenceEnum";
import { DataSource } from "../Model/iTechRestApi/DataSource";

export interface IDataService {
  query(dataSource: string, query: QuerySet, signal?: AbortSignal): Promise<any>;
  gid(dataSource: string, gid: string): Promise<any>;
  convertDurationExpression(expressions: any[]): any[];
  updateStatus(
    dataSource: string,
    id: number,
    filter: ICaseFilter,
    status: iTechControlCaseFileStatusEnum
  ): Promise<void>; // for case datasource only
  reference(
    dataSource: string,
    tableReferenceRowId: string,
    type: iTechControlTableReferenceEnum
  ): Promise<any>;
  fileExport(dataSource: string, query: QuerySet): Promise<any>;
  queryCount(
    dataSource: string,
    expressions: DataSource[],
    signal?: AbortSignal,
    ignoreCaseId?: boolean
  ): Promise<number>;
}

export const dataService: IDataService = {
  // get, // Not currently in use
  query,
  gid,
  convertDurationExpression,
  updateStatus, // for case datasource only
  reference,
  fileExport,
  queryCount,
};

// async function get(dataSource: string, query: QuerySet) {
//   const count = query.paging.end - query.paging.start;
//   const requestOptions = { method: "GET", headers: authHeader() };
//   return await fetch(
//     `${config.apiUrl}/api/${dataSource}/page?start=${
//       query.paging.start
//     }&count=${count}&sortBy=${query.sortBy}&sortDirection=${
//       query.sortDirection
//     }&columns=${query.cols.join(", ")}`,
//     requestOptions
//   ).then(handleResponse);
// }

async function query(dataSource: string, query: QuerySet, signal?: AbortSignal): Promise<any> {
  const expressions = convertDurationExpression(query.expressions);
  const count = query.paging.end - query.paging.start;
  const requestOptions = {
    method: "POST",
    headers: authHeader({ "Content-Type": "application/json" }),
    signal: signal,
    body: JSON.stringify(expressions),
  };

  const url = new URL(`${config.apiUrl}/api/${dataSource}/page`);

  url.searchParams.set("start", query.paging.start.toString());
  url.searchParams.set("count", count.toString());
  if (query.sortBy.length) {
    url.searchParams.set("sortBy", query.sortBy);
  }
  if (query.sortDirection.length) {
    url.searchParams.set("sortDirection", query.sortDirection);
  }
  if (query.searchText.length) {
    url.searchParams.set("search", query.searchText);

    // only relevant when have search text
    if (query.searchOptions) {
      query.searchOptions.forEach((opt) => url.searchParams.append("options", opt.toString()));
    }
  }

  return fetch(url.toString(), requestOptions).then(handleResponse).then(convertDuration);
}

async function queryCount(
  dataSource: string,
  expressions: DataSource[],
  signal?: AbortSignal,
  ignoreCaseId = false
): Promise<number> {
  const requestOptions = {
    method: "POST",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(expressions),
    signal: signal,
  };

  if (ignoreCaseId) {
    // remove the caseid header
    if (requestOptions.headers["X-Soteria-Case-Id"]) {
      delete requestOptions.headers["X-Soteria-Case-Id"];
    }
  }
  const url = new URL(`${config.apiUrl}/api/${dataSource}/count`);

  return fetch(url.toString(), requestOptions).then(handleResponse);
}

async function fileExport(dataSource: string, query: QuerySet): Promise<any> {
  const expressions = convertDurationExpression(query.expressions);
  const requestOptions = {
    method: "POST",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(expressions),
  };

  const url = new URL(`${config.apiUrl}/api/${dataSource}/export`);

  if (query.sortBy.length) {
    url.searchParams.set("sortBy", query.sortBy);
  }
  if (query.sortDirection.length) {
    url.searchParams.set("sortDirection", query.sortDirection);
  }
  if (query.searchText.length) {
    url.searchParams.set("search", query.searchText);

    // only relevant when have search text
    if (query.searchOptions) {
      query.searchOptions.forEach((opt) => url.searchParams.append("options", opt.toString()));
    }
  }

  return fetch(url.toString(), requestOptions).then(handleFileDownload);
}

async function gid(dataSource: string, gid: string): Promise<any> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(`${config.apiUrl}/api/${dataSource}/${gid}`, requestOptions).then(handleResponse);
}

async function reference(
  dataSource: string,
  tableReferenceRowId: string,
  type: iTechControlTableReferenceEnum
): Promise<any> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(
    `${config.apiUrl}/api/${dataSource}/reference?tableReferenceRowId=${tableReferenceRowId}&type=${type}`,
    requestOptions
  ).then(handleResponse);
}

async function updateStatus(
  dataSource: string,
  id: number,
  filter: ICaseFilter,
  status: iTechControlCaseFileStatusEnum
): Promise<void> {
  const requestOptions = {
    method: "PUT",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(filter),
  };
  return await fetch(`${config.apiUrl}/api/${dataSource}/${id}/${status}`, requestOptions).then(
    handleResponse
  );
}

function convertDuration(data: any) {
  if (data?.results?.length) {
    data.results.map((item: any) => {
      item.duration = convertMstoTime(item.duration);
      return item;
    });
  }
  return data;
}

function convertDurationExpression(expressions: any[]): any[] {
  // clones object as this instance is same one as in virtual table columns state
  let setDuration: any = null;
  let durationRange: (number | null)[] = [null, null];
  const newExpressions = expressions.map((exp: any) => {
    const newExp = { ...exp };
    if (exp.filters.length > 0 && exp.filters[0].name === "duration" && exp.filters[0].value) {
      newExp.filters = exp.filters.map((filter: any) => {
        if (filter.name === "duration" && typeof filter.value === "string") {
          const newFilter = { ...filter };
          durationRange = parseTimeRangeToMs(filter.value);
          newFilter.value = durationRange[0];
          newFilter.operation = "GREATER THAN OR EQUALS";
          setDuration = { ...newFilter };
          // setDuration.valueAsText = filter.value;
          return newFilter;
        }
        return filter;
      });
    }
    if (setDuration) {
      const lessThanFilter = {
        operation: setDuration.operation.replace("GREATER", "LESS"),
        // value:  convertTimetoMsAddPeriod(setDuration.valueAsText),
        value: durationRange[1],
        rowId: setDuration.rowId,
        name: setDuration.name,
        iTechControlColumnTypeRowId: setDuration.iTechControlColumnTypeRowId,
      };

      newExp.filters.push(lessThanFilter);
      setDuration = null;
      durationRange = [null, null];
    }
    return newExp;
  });

  return newExpressions;
}
