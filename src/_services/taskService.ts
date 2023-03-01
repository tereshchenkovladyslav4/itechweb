import config from "../config";
import { authHeader } from "../_helpers/authHeader";
import { handleResponse } from "../_helpers/handleResponse";
import { iTechDataTaskOutcomeEnum } from "../Model/iTechRestApi/iTechDataTaskOutcomeEnum";
import { iTechControlTableReferenceEnum } from "../Model/iTechRestApi/iTechControlTableReferenceEnum";
import { ITaskData } from "../Model/iTechRestApi/ITaskData";
import { QuerySet } from "../Model/Types/QuerySet";
import { iTechDataCaseStatusEnum } from "../Model/iTechRestApi/iTechDataCaseStatusEnum";
import { iTechDataCaseOutcomeEnum } from "../Model/iTechRestApi/iTechDataCaseOutcomeEnum";
import { ITechDataTask } from "../Model/iTechRestApi/ITechDataTask";
import { ITechWebTask } from "../Model/iTechRestApi/ITechWebTask";
import { ITechDataDpia } from "../Model/iTechRestApi/ITechDataDpia";
import { ITechDataDpiaV2 } from "../Model/iTechRestApi/ITechDataDpiaV2";
import { ITechDataRopa } from "../Model/iTechRestApi/ITechDataRopa";
import { ITechDataRopaMappingRegister } from "../Model/iTechRestApi/ITechDataRopaMappingRegister";

export const taskService = {
  updates,
  owner,
  setDataSources,
  getDataSources,
  review,
  updateDate,
  complete,
  confirmDeny,
  nextTask,
  verification,
  getTemplates,
  escalate,
  get,
  dpia,
  dpiaV2,
  getDpia,
  getDpiaV2,
  ropa,
  ropaMapping,
};

function get(gid: number): Promise<ITechWebTask> {
  const url = new URL(`${config.apiUrl}/api/iTechWebTask/${gid}`);
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(url.href, requestOptions).then(handleResponse);
}

function complete(
  status: iTechDataCaseStatusEnum,
  outcome: iTechDataCaseOutcomeEnum,
  notes = ""
): Promise<void> {
  const requestOptions = {
    method: "PATCH",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(notes),
  };
  return fetch(
    `${config.apiUrl}/api/iTechWebTask/complete?status=${status}&outcome=${outcome}`,
    requestOptions
  ).then(handleResponse);
}

function confirmDeny(rowId: number, outcome: iTechDataTaskOutcomeEnum): Promise<void> {
  const requestOptions = {
    method: "PATCH",
    headers: authHeader({ "Content-Type": "application/json" }),
  };
  return fetch(
    `${config.apiUrl}/api/iTechWebTask/confirmDeny/${rowId}?outcome=${outcome}`,
    requestOptions
  ).then(handleResponse);
}

function dpia(rowId: number, dpia: ITechDataDpia): Promise<void> {
  const requestOptions = {
    method: "PATCH",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(dpia),
  };
  return fetch(`${config.apiUrl}/api/iTechWebTask/dpia/${rowId}`, requestOptions).then(
    handleResponse
  );
}

function dpiaV2(dpia: ITechDataDpiaV2): Promise<void> {
  const requestOptions = {
    method: "PATCH",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(dpia),
  };
  return fetch(`${config.apiUrl}/api/iTechWebTask/dpiav2`, requestOptions).then(
    handleResponse
  );
}

function ropa(data: ITechDataRopa): Promise<void> {
  const requestOptions = {
    method: "PATCH",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(data),
  };
  return fetch(`${config.apiUrl}/api/iTechWebTask/ropa`, requestOptions).then(
    handleResponse
  );
}

function ropaMapping(data: ITechDataRopaMappingRegister): Promise<void> {
  const requestOptions = {
    method: "PATCH",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(data),
  };
  return fetch(`${config.apiUrl}/api/iTechWebTask/ropamapping`, requestOptions).then(
    handleResponse
  );
}

function getDpia(rowId: string | number): Promise<ITechDataDpia> {
  const url = new URL(`${config.apiUrl}/api/iTechWebTask/dpia/${rowId}`);
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(url.href, requestOptions).then(handleResponse);
}

function getDpiaV2(rowId: string | number): Promise<ITechDataDpiaV2> {
  const url = new URL(`${config.apiUrl}/api/iTechWebTask/dpiav2/${rowId}`);
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(url.href, requestOptions).then(handleResponse);
}

function review(rowId: number, outcome: iTechDataTaskOutcomeEnum, notes: string): Promise<void> {
  const requestOptions = {
    method: "PATCH",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(notes),
  };
  return fetch(
    `${config.apiUrl}/api/iTechWebTask/review/${rowId}?outcome=${outcome}`,
    requestOptions
  ).then(handleResponse);
}

function escalate(
  rowId: number,
  outcome: iTechDataTaskOutcomeEnum | null | undefined,
  notes: string,
  investigatorRowId: number | undefined
): Promise<void> {
  const requestOptions = {
    method: "PATCH",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(notes),
  };
  return fetch(
    `${config.apiUrl}/api/iTechWebTask/escalate/${rowId}?outcome=${outcome}&investigatorRowId=${investigatorRowId}`,
    requestOptions
  ).then(handleResponse);
}

function verification(): Promise<void> {
  const requestOptions = {
    method: "PATCH",
    headers: authHeader({ "Content-Type": "application/json" }),
  };
  return fetch(`${config.apiUrl}/api/iTechWebTask/verification/`, requestOptions).then(
    handleResponse
  );
}

async function owner(data: ITaskData): Promise<void> {
  const requestOptions = {
    method: "PATCH",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(data),
  };
  return await fetch(`${config.apiUrl}/api/iTechWebTask/owner`, requestOptions).then(
    handleResponse
  );
}

async function updates(data: ITaskData): Promise<void> {
  const requestOptions = {
    method: "PATCH",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(data),
  };
  return await fetch(`${config.apiUrl}/api/iTechWebTask/update`, requestOptions).then(
    handleResponse
  );
}

function setDataSources(rowId: number, dataSources: number[]): Promise<void> {
  const url = new URL(`${config.apiUrl}/api/iTechWebTask/datasource/${rowId}`);
  dataSources.forEach((opt) => url.searchParams.append("datasources", opt.toString()));
  const requestOptions = {
    method: "PATCH",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(dataSources),
  };
  return fetch(url.href, requestOptions).then(handleResponse);
}

function getTemplates(): Promise<ITechDataTask[]> {
  const url = new URL(`${config.apiUrl}/api/iTechWebTask/templates`);
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(url.href, requestOptions).then(handleResponse);
}

function getDataSources(): Promise<iTechControlTableReferenceEnum[]> {
  const url = new URL(`${config.apiUrl}/api/iTechWebTask/datasources`);
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(url.href, requestOptions).then(handleResponse);
}

function updateDate(rowId: number, start: number, end: number): Promise<void> {
  const url = new URL(`${config.apiUrl}/api/iTechWebTask/taskTime/${rowId}`);
  const requestOptions = {
    method: "PATCH",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify({ start, end }),
  };
  return fetch(url.href, requestOptions).then(handleResponse);
}

async function nextTask(currentRowId: number, query: QuerySet): Promise<number | null> {
  const expressions = query.expressions;
  const count = query.paging.end - query.paging.start;
  const requestOptions = {
    method: "POST",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(expressions),
  };

  const url = new URL(`${config.apiUrl}/api/iTechWebTask/nextTask/${currentRowId}`);

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

  return fetch(url.toString(), requestOptions).then(handleResponse);
}
