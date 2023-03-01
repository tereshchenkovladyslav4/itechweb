import config from "../config";
import { authHeader } from "../_helpers/authHeader";
import { handleFileDownload, handleResponse } from "../_helpers/handleResponse";
import { ResultSet } from "../Model/iTechRestApi/ResultSet";
import { CaseModel } from "../Model/iTechRestApi/CaseModel";
import { CaseSummary } from "../Model/iTechRestApi/CaseSummary";
import { CaseUser } from "../Model/iTechRestApi/CaseUser";
import { IAddToCase, ICaseData } from "../Model/iTechRestApi/ICaseData";
import { getJsonNetObject } from "../_helpers/jsonref";
import { ITechResultSet } from "../Model/iTechRestApi/ITechResultSet";
import { iTechDataCaseStatusEnum } from "../Model/iTechRestApi/iTechDataCaseStatusEnum";
import { ITechCaseStatus } from "../Model/iTechRestApi/ITechCaseStatus";
import { iTechDataCaseSubEnum } from "../Model/iTechRestApi/iTechDataCaseSubEnum";
import { BaseResponse } from "../Model/iTechRestApi/BaseResponse";

export const caseService = {
  get,
  update,
  add,
  remove,
  search,
  getAll,
  gdpr,
  updateStatus,
  getCaseStatus, // all cases
  // getCaseTypes,
  getTasksOutstanding,
  hasZipFile,
  downloadZipFile,
  alert,
  getSubTypes,
  addItems,
  caseTypes,
  caseSubTypes,
};

async function getAll(): Promise<ITechResultSet[]> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return await fetch(`${config.apiUrl}/api/iTechDataCase/`, requestOptions).then(handleResponse);
}

async function getCaseStatus(): Promise<ITechCaseStatus[]> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return await fetch(`${config.apiUrl}/api/iTechDataCase/GetStatus`, requestOptions).then(
    handleResponse
  );
}

async function get(id: number): Promise<CaseModel> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return await fetch(`${config.apiUrl}/api/iTechDataCase/${id}`, requestOptions)
    .then(handleResponse)
    .then((x: CaseModel) => {
      if ((x.investigatorITechDataSecurityObject as any)?.$id) {
        x.investigatorITechDataSecurityObject = getJsonNetObject(
          x.investigatorITechDataSecurityObject,
          x
        );
        // remove $id props as no longer refs
        delete (x.investigatorITechDataSecurityObject as any).$id;
      }
      x.caseUsers?.forEach((user: CaseUser) => {
        user.iTechDataSecurityObject = getJsonNetObject(user.iTechDataSecurityObject, x);
      });
      // remove $id props as no longer refs
      delete (x.investigatorITechDataSecurityObject as any).$id;
      x.caseUsers?.forEach((user: any) => {
        delete user.iTechDataSecurityObject.$id;
      });
      return x;
    });
}

async function search(text: string): Promise<ResultSet<CaseSummary>> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return await fetch(`${config.apiUrl}/api/iTechDataCase/search?text=${text}`, requestOptions).then(
    (response) => handleResponse(response, [404])
  );
}

async function getSubTypes(caseTypeRowId: number): Promise<iTechDataCaseSubEnum[]> {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };
  return await fetch(
    `${config.apiUrl}/api/iTechDataCase/subTypes/${caseTypeRowId}`,
    requestOptions
  ).then(handleResponse);
}

async function add(data: ICaseData): Promise<CaseModel> {
  const requestOptions = {
    method: "POST",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(data),
  };
  return await fetch(`${config.apiUrl}/api/iTechDataCase`, requestOptions).then(handleResponse);
}

async function addItems(data: IAddToCase): Promise<BaseResponse> {
  const requestOptions = {
    method: "POST",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(data),
  };
  return await fetch(`${config.apiUrl}/api/iTechDataCase/addItemsToCase`, requestOptions).then(
    handleResponse
  );
}

async function gdpr(data: ICaseData): Promise<any> {
  const requestOptions = {
    method: "POST",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(data),
  };
  return await fetch(`${config.apiUrl}/api/iTechDataCase/gdpr`, requestOptions).then(
    handleResponse
  );
}

async function alert(data: ICaseData): Promise<CaseModel> {
  const requestOptions = {
    method: "POST",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(data),
  };
  return await fetch(`${config.apiUrl}/api/iTechDataCase/alert`, requestOptions).then(
    handleResponse
  );
}

async function update(id: number, data: ICaseData): Promise<void> {
  const requestOptions = {
    method: "PUT",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(data),
  };
  return await fetch(`${config.apiUrl}/api/iTechDataCase/${id}`, requestOptions).then(
    handleResponse
  );
}

async function remove(id: number): Promise<void> {
  const requestOptions = {
    method: "DELETE",
    headers: authHeader({ "Content-Type": "application/json" }),
  };
  return await fetch(`${config.apiUrl}/api/iTechDataCase/${id}`, requestOptions).then(
    handleResponse
  );
}

async function updateStatus(rowId: number, status: iTechDataCaseStatusEnum): Promise<void> {
  const requestOptions = {
    method: "PATCH",
    headers: authHeader({ "Content-Type": "application/json" }),
  };
  return await fetch(
    `${config.apiUrl}/api/iTechDataCase/${rowId}?status=${status}`,
    requestOptions
  ).then(handleResponse);
}

async function getTasksOutstanding(caseId: number): Promise<number> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return await fetch(
    `${config.apiUrl}/api/iTechDataCase/GetTasksOutstanding/${caseId}`,
    requestOptions
  ).then(handleResponse);
}

async function hasZipFile(): Promise<boolean> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return await fetch(`${config.apiUrl}/api/iTechFsi/HasCaseZip`, requestOptions).then(
    handleResponse
  );
}

async function downloadZipFile(): Promise<any> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(`${config.apiUrl}/api/iTechFsi/case`, requestOptions).then(handleFileDownload);
}

async function caseTypes(): Promise<number[]> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return await fetch(`${config.apiUrl}/api/iTechDataCase/caseTypes`, requestOptions).then(
    handleResponse
  );
}

async function caseSubTypes(): Promise<number[]> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return await fetch(`${config.apiUrl}/api/iTechDataCase/caseSubTypes`, requestOptions).then(
    handleResponse
  );
}

// Just using enum for case types

// async function getCaseTypes() : Promise<any[]> {
//   const url = new URL(`${config.apiUrl}/api/iTechDataCase/CaseTypes`);
//   const requestOptions = { method: "GET", headers: authHeader() };

//   return await fetch(
//       url.href,
//       requestOptions
//   ).then(handleResponse);
// }
