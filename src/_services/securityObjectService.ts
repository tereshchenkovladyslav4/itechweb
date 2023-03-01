import config from "../config";
import { ITechDataSecurityObject } from "../Model/iTechRestApi/ITechDataSecurityObject";
import { SecurityObjectModel } from "../Model/iTechRestApi/SecurityObjectModel";
import { authHeader } from "../_helpers/authHeader";
import { handleResponse } from "../_helpers/handleResponse";

export const securityObjectService = {
  search,
  current,
  groups,
  get,
  getAll,
  adminAdd,
  adminUpdate,
  adminArchive,
  adminResetPassword,
};

function adminResetPassword(userId: string | number): Promise<string[]> {
  const requestOptions = { method: "GET", headers: authHeader() };

  return fetch(
    `${config.apiUrl}/api/iTechDataSecurityObject/resetPassword/${userId}`,
    requestOptions
  )
    .then(handleResponse)
    .then((response: string[]) => {
      return response;
    });
}

function adminArchive(userId: string | number): Promise<string[]> {
  const requestOptions = { method: "GET", headers: authHeader() };

  return fetch(`${config.apiUrl}/api/iTechDataSecurityObject/archive/${userId}`, requestOptions)
    .then(handleResponse)
    .then((response: string[]) => {
      return response;
    });
}

function adminAdd(user: ITechDataSecurityObject): Promise<string[]> {
  const requestOptions = {
    method: "POST",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(user),
  };

  return fetch(`${config.apiUrl}/api/iTechDataSecurityObject`, requestOptions)
    .then(handleResponse)
    .then((response: string[]) => {
      return response;
    });
}

function adminUpdate(user: ITechDataSecurityObject): Promise<string[]> {
  const requestOptions = {
    method: "PUT",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(user),
  };

  return fetch(`${config.apiUrl}/api/iTechDataSecurityObject`, requestOptions)
    .then(handleResponse)
    .then((response: string[]) => {
      return response;
    });
}

function search(text: string, isLogin?: boolean, isCollection?: boolean) {
  const login = isLogin !== undefined ? `&isLogin=${isLogin ?? false}` : "";
  const collection = isCollection !== undefined ? `&isCollection=${isCollection}` : "";
  return fetch(
    `${config.apiUrl}/api/iTechDataSecurityObject/search?text=${text}${login}${collection}`,
    { method: "GET", headers: authHeader() }
  ).then(handleResponse);
}

function groups(): Promise<ITechDataSecurityObject[]> {
  return fetch(`${config.apiUrl}/api/iTechDataSecurityObject/groups`, {
    method: "GET",
    headers: authHeader(),
  }).then(handleResponse);
}

// get the name & id of all active users
function getAll(): Promise<SecurityObjectModel[]> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(`${config.apiUrl}/api/iTechDataSecurityObject/allActive`, requestOptions).then(
    handleResponse
  );
}

function current(): Promise<ITechDataSecurityObject> {
  return fetch(`${config.apiUrl}/api/iTechDataSecurityObject/current`, {
    method: "GET",
    headers: authHeader(),
  }).then(handleResponse);
}

function get(id: number): Promise<ITechDataSecurityObject> {
  return fetch(`${config.apiUrl}/api/iTechDataSecurityObject/${id}`, {
    method: "GET",
    headers: authHeader(),
  }).then(handleResponse);
}
