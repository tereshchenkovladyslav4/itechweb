import config from "../config";
import { authHeader } from "../_helpers/authHeader";
import { handleResponse } from "../_helpers/handleResponse";
import { ITechDataWebTab } from "../Model/iTechRestApi/ITechDataWebTab";

export const tabService = {
  get,
  selected,
  add,
  position,
  update,
  remove,
  name,
  getAll,
};

function get(rowId: number): Promise<ITechDataWebTab> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(
    `${config.apiUrl}/api/iTechDataWebTab/${rowId}`,
    requestOptions
  ).then(handleResponse);
}

function selected(rowId: number): Promise<void> {
  const requestOptions = { method: "PATCH", headers: authHeader() };
  return fetch(
    `${config.apiUrl}/api/iTechDataWebTab/selected/${rowId}`,
    requestOptions
  ).then(handleResponse);
}

function add(tab: ITechDataWebTab): Promise<ITechDataWebTab> {
  const requestOptions = {
    method: "POST",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(tab),
  };
  return fetch(`${config.apiUrl}/api/iTechDataWebTab`, requestOptions).then(
    handleResponse
  );
}

function position(rowId: number, position: number): Promise<void> {
  const requestOptions = { method: "PATCH", headers: authHeader() };
  return fetch(
    `${config.apiUrl}/api/iTechDataWebTab/${rowId}?position=${position}`,
    requestOptions
  ).then(handleResponse);
}

function name(rowId: number, name: string): Promise<void> {
  const requestOptions = { method: "PATCH", headers: authHeader() };
  return fetch(
    `${config.apiUrl}/api/iTechDataWebTab/${rowId}?name=${name}`,
    requestOptions
  ).then(handleResponse);
}

function update(tabs: ITechDataWebTab[]): Promise<void> {
  const requestOptions = {
    method: "PUT",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(tabs),
  };
  return fetch(`${config.apiUrl}/api/iTechDataWebTab`, requestOptions).then(
    handleResponse
  );
}

function remove(rowId: number): Promise<ITechDataWebTab> {
  const requestOptions = { method: "DELETE", headers: authHeader() };
  return fetch(
    `${config.apiUrl}/api/iTechDataWebTab/${rowId}`,
    requestOptions
  ).then(handleResponse);
}

async function getAll(): Promise<ITechDataWebTab[]> {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };
  return await fetch(
    `${config.apiUrl}/api/iTechDataWebTab/case`,
    requestOptions
  ).then(handleResponse);
}
