import config from "../config";
import { authHeader } from "../_helpers/authHeader";
import { handleResponse } from "../_helpers/handleResponse";
import { ITechWebReportConfiguration } from "../Model/iTechRestApi/ITechWebReportConfiguration";
import { IReportConfiguration } from "../Model/iTechRestApi/IReportConfiguration";

export const reportConfigurationService = {
  get,
  getAll,
  add,
  edit,
  remove,
};

function get(gid: string | number): Promise<IReportConfiguration> {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };
  return fetch(`${config.apiUrl}/api/iTechWebReportConfiguration/${gid}`, requestOptions).then(
    handleResponse
  );
}

function getAll(): Promise<ITechWebReportConfiguration[]> {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };
  return fetch(`${config.apiUrl}/api/iTechWebReportConfiguration`, requestOptions)
    .then(handleResponse)
    .then((response: ITechWebReportConfiguration[]) => {
      return response;
    });
}

function add(newReport: IReportConfiguration) {
  const requestOptions = {
    method: "POST",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(newReport),
  };
  return fetch(`${config.apiUrl}/api/iTechWebReportConfiguration`, requestOptions).then(
    handleResponse
  );
}

function edit(newReport: IReportConfiguration) {
  const requestOptions = {
    method: "PUT",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(newReport),
  };
  return fetch(`${config.apiUrl}/api/iTechWebReportConfiguration`, requestOptions).then(
    handleResponse
  );
}

async function remove(gids: (string | number | undefined)[]): Promise<number> {
  const requestOptions = {
    method: "DELETE",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(gids),
  };
  return await fetch(`${config.apiUrl}/api/iTechWebReportConfiguration/`, requestOptions).then(
    handleResponse
  );
}
