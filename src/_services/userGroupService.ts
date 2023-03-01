import config from "../config";
import { authHeader } from "../_helpers/authHeader";
import { handleResponse } from "../_helpers/handleResponse";
import { ITechWebUserGroup } from "../Model/iTechRestApi/ITechWebUserGroup";
import { ICheckedSet } from "../Model/iTechRestApi/ICheckedSet";

export const userGroupService = {
  search,
  get,
  allChecked,
  add,
  deleteGroup,
  references,
  removeReferences,
};

function search(text: string): Promise<ITechWebUserGroup[]> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(`${config.apiUrl}/api/iTechWebUserGroup/search?text=${text}`, requestOptions)
    .then(handleResponse)
    .then((response: ITechWebUserGroup[]) => {
      return response;
    });
}

function get(id: string | number): Promise<ITechWebUserGroup> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(`${config.apiUrl}/api/iTechWebUserGroup/${id}`, requestOptions)
    .then(handleResponse)
    .then((response: ITechWebUserGroup) => {
      return response;
    });
}

async function allChecked(groupId: number, checkedSet: ICheckedSet): Promise<number> {
  const requestOptions = {
    method: "POST",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(checkedSet),
  };
  return await fetch(
    `${config.apiUrl}/api/iTechWebUserGroup/allChecked/${groupId}`,
    requestOptions
  ).then(handleResponse);
}

async function add(name: string, gids: number[]): Promise<number> {
  const requestOptions = {
    method: "POST",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify({ name: name, gids: gids }),
  };

  return await fetch(`${config.apiUrl}/api/iTechWebUserGroup/`, requestOptions).then(
    handleResponse
  );
}

async function deleteGroup(groupId: string | number): Promise<number> {
  const requestOptions = {
    method: "DELETE",
    headers: authHeader(),
  };

  return await fetch(`${config.apiUrl}/api/iTechWebUserGroup/${groupId}`, requestOptions).then(
    handleResponse
  );
}

async function references(groupId: string | number, gids: number[]): Promise<number> {
  const requestOptions = {
    method: "PUT",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(gids),
  };

  return await fetch(
    `${config.apiUrl}/api/iTechWebUserGroup/references/${groupId}`,
    requestOptions
  ).then(handleResponse);
}

async function removeReferences(
  groupId: string | number,
  gids: (string | number)[]
): Promise<number> {
  const requestOptions = {
    method: "DELETE",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(gids),
  };

  return await fetch(
    `${config.apiUrl}/api/iTechWebUserGroup/references/${groupId}`,
    requestOptions
  ).then(handleResponse);
}
