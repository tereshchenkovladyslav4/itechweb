import config from "../config";
import { Transcript } from "../Model/iTechRestApi/Transcript";
import { authHeader } from "../_helpers/authHeader";
import { handleResponse } from "../_helpers/handleResponse";

export const transcriptService = {
  get,
};

async function get(id: number) :Promise<Transcript> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return await fetch(
    `${config.apiUrl}/api/iTechWebSim/transcript/${id}`,
    requestOptions
  ).then((response) => handleResponse(response, [404]));
}
