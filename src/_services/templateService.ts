import config from "../config";
import { authHeader } from "../_helpers/authHeader";
import { handleResponse } from "../_helpers/handleResponse";
import { NewTemplateRequest } from "../Model/iTechRestApi/NewTemplateRequest";
import { ApplyTemplateRequest } from "../Model/iTechRestApi/ApplyTemplateRequest";
import { ITechDataWebTemplate } from "../Model/iTechRestApi/ITechDataWebTemplate";

export const templateService = {
  getAll,
  add,
  remove,
  apply,
  get,
};

function get(ds:string): Promise<ITechDataWebTemplate[]> {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };
  return fetch(`${config.apiUrl}/api/iTechDataWebTemplate/${ds}`, requestOptions)
    .then(handleResponse)
    .then((response: ITechDataWebTemplate[]) => {
      return response;
    });
}

function getAll(): Promise<ITechDataWebTemplate[]> {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };
  return fetch(`${config.apiUrl}/api/iTechDataWebTemplate`, requestOptions)
    .then(handleResponse)
    .then((response: ITechDataWebTemplate[]) => {
      return response;
    });
}

function add(newTemplate: NewTemplateRequest) {
  const requestOptions = {
    method: "POST",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(newTemplate),
  };
  return fetch(
    `${config.apiUrl}/api/iTechDataWebTemplate`,
    requestOptions
  ).then(handleResponse);
}

function remove(rowId: number) {
  const requestOptions = { method: "DELETE", headers: authHeader() };
  return fetch(
    `${config.apiUrl}/api/iTechDataWebTemplate/${rowId}`,
    requestOptions
  ).then(handleResponse);
}

function apply(template: ApplyTemplateRequest) {
  const requestOptions = {
    method: "POST",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(template),
  };
  return fetch(
    `${config.apiUrl}/api/iTechDataWebTemplate/apply`,
    requestOptions
  ).then(handleResponse);
}
