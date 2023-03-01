import config from "../config";
import { SimVersions } from "../Model/iTechRestApi/SimVersions";
import { authHeader } from "../_helpers/authHeader";
import { handleResponse } from "../_helpers/handleResponse";

export const versionService = {
  get,
};

function get(simRowId: string): Promise<SimVersions> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(
    `${config.apiUrl}/api/versions/${simRowId}`,
    requestOptions
  ).then(handleResponse);
}
