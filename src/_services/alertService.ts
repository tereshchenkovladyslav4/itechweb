import config from "../config";
import { authHeader } from "../_helpers/authHeader";
import { handleResponse } from "../_helpers/handleResponse";
import { ITechWebAlert } from "../Model/iTechRestApi/ITechWebAlert";

export const alertService = {
  get,
  update,
  add,
  getAll,
};

async function get(id: string | number): Promise<ITechWebAlert> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return await fetch(`${config.apiUrl}/api/iTechWebAlert/${id}`, requestOptions).then(
    handleResponse
  );
}

async function getAll(): Promise<ITechWebAlert[]> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return await fetch(`${config.apiUrl}/api/iTechWebAlert/`, requestOptions).then(handleResponse);
}

async function update(result: ITechWebAlert): Promise<void | never> {
  const requestOptions = {
    method: "PUT",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(result),
  };
  return await fetch(`${config.apiUrl}/api/iTechWebAlert/${result.gid}`, requestOptions).then(
    handleResponse
  );
}

async function add(result: ITechWebAlert): Promise<ITechWebAlert> {
  const requestOptions = {
    method: "POST",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(result),
  };
  return await fetch(`${config.apiUrl}/api/iTechWebAlert`, requestOptions).then(handleResponse);
}
