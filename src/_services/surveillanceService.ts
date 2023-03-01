import config from "../config";
import { SurveillanceTaskExtended } from "../Model/Extended/SurveillanceTaskExtended";
import { SurveillanceTask } from "../Model/iTechRestApi/SurveillanceTask";
import { authHeader } from "../_helpers/authHeader";
import { handleResponse } from "../_helpers/handleResponse";

export const surveillanceService = {
  add,
  update,
  get,
  remove,
};

function get(gid: number | string): Promise<SurveillanceTask> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(`${config.apiUrl}/api/iTechWebSurveillance/data/${gid}`, requestOptions).then(
    handleResponse
  );
}

async function remove(gids: (string | number | undefined)[]): Promise<number> {
  const requestOptions = {
    method: "DELETE",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(gids),
  };
  return await fetch(`${config.apiUrl}/api/iTechWebSurveillance/`, requestOptions).then(
    handleResponse
  );
}

async function add(surveillance: SurveillanceTaskExtended): Promise<SurveillanceTask> {
  surveillance.filterJSON = JSON.stringify(surveillance.filters);

  const requestOptions = {
    method: "POST",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(surveillance),
  };

  const url = new URL(`${config.apiUrl}/api/iTechWebSurveillance`);
  return fetch(url.toString(), requestOptions).then(handleResponse);
}

async function update(surveillance: SurveillanceTaskExtended): Promise<void> {
  surveillance.filterJSON = JSON.stringify(surveillance.filters);

  const requestOptions = {
    method: "PATCH",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(surveillance),
  };
  return await fetch(
    `${config.apiUrl}/api/iTechWebSurveillance/${surveillance.rowId}`,
    requestOptions
  ).then(handleResponse);
}
