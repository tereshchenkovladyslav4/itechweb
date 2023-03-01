import config from '../config'
import { authHeader } from '../_helpers/authHeader'
import { handleResponse } from '../_helpers/handleResponse'
import { parseJSON } from '../_helpers/jsonParser'
import { ITechDataWebComponentExtended } from '../Model/Extended/ITechDataWebComponentExtended'
import { ComponentTabInfo } from '../Model/iTechRestApi/ComponentTabInfo'
import { iTechDataWebTabEnum } from '../Model/iTechRestApi/iTechDataWebTabEnum'
import { ITechDataWebComponent } from '../Model/iTechRestApi/ITechDataWebComponent'

export const componentService = {
  get,
  add,
  position,
  update,
  remove,
  tab,
  json,
  userHasComponentTab,
  tabType,
};

function get(rowId: number) {
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(
    `${config.apiUrl}/api/iTechDataWebComponent/${rowId}`,
    requestOptions
  )
    .then(handleResponse)
    .then(_jsonUpdater);
}

function add(tab: ITechDataWebComponentExtended) {
  const requestOptions = {
    method: "POST",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(tab),
  };
  return fetch(`${config.apiUrl}/api/iTechDataWebComponent`, requestOptions)
    .then(handleResponse)
    .then(_jsonUpdater);
}

function position(rowId: number, x: number, y: number, h: number, w: number) {
  const requestOptions = { method: "PATCH", headers: authHeader() };
  return fetch(
    `${config.apiUrl}/api/iTechDataWebComponent/${rowId}?x=${x}&y=${y}&h=${h}&w=${w}`,
    requestOptions
  ).then(handleResponse);
}

function json(rowId: number, data: ITechDataWebComponentExtended) {
  const requestOptions = {
    method: "POST",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(data),
  };
  return fetch(
    `${config.apiUrl}/api/iTechDataWebComponent/${rowId}`,
    requestOptions
  ).then((response) => handleResponse(response, [404]));
}

function tab(rowId: number) : Promise<ITechDataWebComponent[]>{
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(
    `${config.apiUrl}/api/iTechDataWebComponent/tab/${rowId}`,
    requestOptions
  ).then(handleResponse);
}

function tabType(tabType: iTechDataWebTabEnum) : Promise<ITechDataWebComponent[]>{
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(
    `${config.apiUrl}/api/iTechDataWebComponent/tabType/${tabType}`,
    requestOptions
  ).then(handleResponse);
}

function update(component: ITechDataWebComponentExtended) {
  const requestOptions = {
    method: "PUT",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(component),
  };
  return fetch(
    `${config.apiUrl}/api/iTechDataWebComponent`,
    requestOptions
  ).then(handleResponse);
}

function remove(rowId: number) {
  const requestOptions = { method: "DELETE", headers: authHeader() };
  return fetch(
    `${config.apiUrl}/api/iTechDataWebComponent/${rowId}`,
    requestOptions
  ).then(handleResponse);
}

function _jsonUpdater(data: ITechDataWebComponentExtended) {
  const obj = { ...data };
  obj.data = parseJSON(obj.json);
  return obj;
}

function userHasComponentTab(searchText: string) : Promise<ComponentTabInfo>  {
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(
    `${config.apiUrl}/api/iTechDataWebComponent/search/${searchText}`,
    requestOptions
  ).then(handleResponse);
}
