import config from "../config";
import { authHeader } from "../_helpers/authHeader";
import { handleResponse } from "../_helpers/handleResponse";

export const challengeService = {
  get,
  put,
};

function get() {
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(`${config.apiUrl}/api/Challenge/`, requestOptions).then(
    handleResponse
  );
}

function put(answer: any) {
  const requestOptions = {
    method: "PUT",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(answer),
  };
  return fetch(`${config.apiUrl}/api/Challenge/`, requestOptions).then(
    handleResponse
  );
}
