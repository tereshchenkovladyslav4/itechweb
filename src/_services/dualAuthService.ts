import config from "../config";
import { authHeader } from "../_helpers/authHeader";
import { handleResponse } from "../_helpers/handleResponse";

export const dualAuthService = {
  get,
  identifier,
  code,
};

function get() {
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(`${config.apiUrl}/api/DualAuth/`, requestOptions).then(
    handleResponse
  );
}

function identifier(identifier: string) {
  const requestOptions = {
    method: "PUT",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(identifier),
  };
  return fetch(`${config.apiUrl}/api/DualAuth/identifier`, requestOptions).then(
    handleResponse
  );
}

function code(code: string) {
  const requestOptions = {
    method: "PUT",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(code),
  };
  return fetch(`${config.apiUrl}/api/DualAuth/code`, requestOptions).then(
    handleResponse
  );
}
