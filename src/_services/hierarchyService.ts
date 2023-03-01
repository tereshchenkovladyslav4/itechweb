import config from "../config";
import { authHeader } from "../_helpers/authHeader";
import { handleResponse } from "../_helpers/handleResponse";
import { QuerySet } from "../Model/Types/QuerySet";
import { DataSource } from "../Model/iTechRestApi/DataSource";
import { iTechControlTableReferenceEnum } from "../Model/iTechRestApi/iTechControlTableReferenceEnum";
import { IDataService } from "./dataService";

export { query, queryCount, gid, reference };

export const dataService = (asc: boolean): IDataService => {
  return {
    query: query(asc),
    queryCount: queryCount(asc),
    gid: gid(asc),
    reference: reference(asc),
    fileExport: fileExport(asc),
    convertDurationExpression: () => [],
    updateStatus: () => Promise.reject(),
  };
};

const query = (asc: boolean) =>
  (async function query(dataSource: string, query: QuerySet, signal?: AbortSignal): Promise<any> {
    return request(asc, signal);
  });

const queryCount = (asc: boolean) =>
  (async function queryCount(
    dataSource: string,
    expressions: DataSource[],
    signal?: AbortSignal,
    ignoreCaseId = false
  ): Promise<number> {
    return request(asc, signal).then(convertCount);
  });

function convertCount(data: any) {
  return data?.results?.length;
}

const gid = (asc: boolean) =>
  (async function gid(dataSource: string, gid: string): Promise<any> {
    return request(asc);
  });

const reference = (asc: boolean) =>
  (async function reference(
    dataSource: string,
    tableReferenceRowId: string,
    type: iTechControlTableReferenceEnum
  ): Promise<any> {
    return request(asc);
  });

const fileExport = (asc: boolean) =>
  (async function fileExport(dataSource: string, query: QuerySet): Promise<any> {
    return request(asc);
  });

const request = (asc: boolean, signal?: AbortSignal) => {
  const requestOptions = { method: "GET", headers: authHeader() };
  const url = new URL(`${config.apiUrl}/api/iTechWebHr/hierarchy/${asc}`);
  return fetch(url.toString(), requestOptions).then(handleResponse);
};
