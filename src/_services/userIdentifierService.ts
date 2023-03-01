import config from "../config";
import { authHeader } from "../_helpers/authHeader";
import { handleResponse } from "../_helpers/handleResponse";
import { ITechDataUserIdentifier } from "../Model/iTechRestApi/ITechDataUserIdentifier";

export const userIdentifierService = {
  search,
  get,
};

function search(text: string): Promise<ITechDataUserIdentifier[]> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(
    `${config.apiUrl}/api/iTechDataUserIdentifier/search?text=${text}`,
    requestOptions
  )
    .then(handleResponse)
    .then((response: ITechDataUserIdentifier[]) => {
      return response;
    });
}

function get(id: number | null): Promise<ITechDataUserIdentifier> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(
    `${config.apiUrl}/api/iTechDataUserIdentifier/${id}`,
    requestOptions
  )
    .then(handleResponse)
    .then((response: ITechDataUserIdentifier) => {
      return response;
    });
}
