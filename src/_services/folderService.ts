import config from "../config";
import { authHeader } from "../_helpers/authHeader";
import { handleResponse } from "../_helpers/handleResponse";
import { ITechDataWebFolder } from "../Model/iTechRestApi/ITechDataWebFolder";
import { Folder } from "../Model/iTechRestApi/Folder";

export const folderService = {
  get,
  getAll,
  casePath,
};

async function get(id: number): Promise<ITechDataWebFolder[]> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return await fetch(`${config.apiUrl}/api/iTechDataWebFolder/${id}`, requestOptions).then(
    handleResponse
  );
}

async function getAll(): Promise<ITechDataWebFolder[]> {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };
  return await fetch(`${config.apiUrl}/api/iTechDataWebFolder/case`, requestOptions).then(
    handleResponse
  );
}

async function casePath(caseName: string): Promise<Folder> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return await fetch(
    `${config.apiUrl}/api/iTechDataWebFolder/cases?name=${caseName}`,
    requestOptions
  ).then(handleResponse);
}
