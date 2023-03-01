import config from "../config";
import { authHeader } from "../_helpers/authHeader";
import { handleResponse } from "../_helpers/handleResponse";
import { ITechWebHr } from "../Model/iTechRestApi/ITechWebHr";

export const hrService = {
  get,
  getUser,
};

async function get(id: string | number): Promise<ITechWebHr> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return await fetch(`${config.apiUrl}/api/iTechWebHr/${id}`, requestOptions).then(handleResponse);
}

async function getUser(userId: string | number): Promise<ITechWebHr[]> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return await fetch(`${config.apiUrl}/api/iTechWebHr/user/${userId}`, requestOptions).then(
    handleResponse
  );
}
