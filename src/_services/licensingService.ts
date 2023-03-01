import config from "../config";
import { ITechWebLicensing } from "../Model/iTechRestApi/ITechWebLicensing";
import { authHeader } from "../_helpers/authHeader";
import { handleResponse } from "../_helpers/handleResponse";

export const licensingService = {
  search,
  get,
  getAll,
};

function search(text: string) {
  return fetch(`${config.apiUrl}/api/ITechWebLicensing/search?text=${text}`, {
    method: "GET",
    headers: authHeader(),
  }).then(handleResponse);
}

function getAll(): Promise<ITechWebLicensing[]> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(`${config.apiUrl}/api/ITechWebLicensing/allActive`, requestOptions).then(
    handleResponse
  );
}

function get(id: number): Promise<ITechWebLicensing> {
  return fetch(`${config.apiUrl}/api/ITechWebLicensing/${id}`, {
    method: "GET",
    headers: authHeader(),
  }).then(handleResponse);
}
