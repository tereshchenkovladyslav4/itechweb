import config from "../config";
import { authHeader } from "../_helpers/authHeader";
import { handleResponse } from "../_helpers/handleResponse";
import { ITechControlRetentionPolicy } from "../Model/iTechRestApi/ITechControlRetentionPolicy";

export const retentionPolicyService = {
  getAll,
  getById,
};

function getAll(): Promise<ITechControlRetentionPolicy[]> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(`${config.apiUrl}/api/iTechControlRetentionPolicy`, requestOptions)
    .then(handleResponse)
    .then((response: ITechControlRetentionPolicy[]) => {
      return response;
    });
}

function getById(id: number): Promise<ITechControlRetentionPolicy> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(`${config.apiUrl}/api/iTechControlRetentionPolicy/${id}`, requestOptions)
    .then(handleResponse)
    .then((response: ITechControlRetentionPolicy) => {
      return response;
    });
}
