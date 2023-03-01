import config from "../config";
import { authHeader } from "../_helpers/authHeader";
import { handleResponse } from "../_helpers/handleResponse";
import { ITechControlTable } from "../Model/iTechRestApi/ITechControlTable";

export const tableService = {
  getAll,
  name,
};

function getAll(): Promise<ITechControlTable[]> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(`${config.apiUrl}/api/iTechControlTable`, requestOptions)
    .then(handleResponse)
    .then((response: ITechControlTable[]) => {
      return response;
    });
}

function name(name: string): Promise<ITechControlTable> {
  if (name === "ITechWebSavedResults") name = "iTechWebSim"; // TODO - call when for SavedResults needs to map to its original schema
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(`${config.apiUrl}/api/iTechControlTable/${name}`, requestOptions)
    .then(handleResponse)
    .then((response: ITechControlTable) => {
      return response;
    });
}
