import config from "../config";
import { authHeader } from "../_helpers/authHeader";
import { handleResponse } from "../_helpers/handleResponse";
import { ITechDataUser } from "../Model/iTechRestApi/ITechDataUser";
import { ITechWebUser } from "../Model/iTechRestApi/ITechWebUser";
import { NumberFilter } from "ag-grid-community";

export const userService = {
  search,
  get,
  getAll,
  group,
  userGroups,
  references,
  iTechWebUser,
  adminAdd,
  adminUpdate,
  adminArchive,
};

function adminArchive(userId: string | number): Promise<string[]> {
  const requestOptions = { method: "GET", headers: authHeader() };

  return fetch(`${config.apiUrl}/api/iTechDataUser/archive/${userId}`, requestOptions)
    .then(handleResponse)
    .then((response: string[]) => {
      return response;
    });
}

function adminAdd(user: ITechDataUser): Promise<string[]> {
  const requestOptions = {
    method: "POST",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(user),
  };

  return fetch(`${config.apiUrl}/api/iTechDataUser`, requestOptions)
    .then(handleResponse)
    .then((response: string[]) => {
      return response;
    });
}

function adminUpdate(user: ITechDataUser): Promise<string[]> {
  const requestOptions = {
    method: "PUT",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(user),
  };

  return fetch(`${config.apiUrl}/api/iTechDataUser`, requestOptions)
    .then(handleResponse)
    .then((response: string[]) => {
      return response;
    });
}

function search(text: string): Promise<ITechDataUser[]> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(`${config.apiUrl}/api/iTechDataUser/search?text=${text}`, requestOptions)
    .then(handleResponse)
    .then((response: ITechDataUser[]) => {
      return response;
    });
}

function get(id: number | null): Promise<ITechDataUser> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(`${config.apiUrl}/api/ITechDataUser/${id}`, requestOptions)
    .then(handleResponse)
    .then((response: ITechDataUser) => {
      return response;
    });
}

function getAll(): Promise<ITechDataUser[]> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(`${config.apiUrl}/api/ITechDataUser`, requestOptions).then(handleResponse);
}

function group(groupId: string | number): Promise<ITechDataUser[]> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(`${config.apiUrl}/api/ITechWebUser/group/${groupId}`, requestOptions).then(
    handleResponse
  );
}

function userGroups(userId: string | number): Promise<ITechDataUser[]> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(`${config.apiUrl}/api/ITechWebUser/usergroups/${userId}`, requestOptions).then(
    handleResponse
  );
}

function iTechWebUser(userId: string | number): Promise<ITechWebUser> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(`${config.apiUrl}/api/ITechWebUser/${userId}`, requestOptions).then(handleResponse);
}

async function references(userId: string | number, gids: number[]): Promise<number> {
  const requestOptions = {
    method: "PUT",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(gids),
  };

  return await fetch(`${config.apiUrl}/api/ITechWebUser/references/${userId}`, requestOptions).then(
    handleResponse
  );
}
