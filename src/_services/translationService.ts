import config from "../config";
import { Country } from "../Model/iTechRestApi/Country";
import { Translation } from "../Model/iTechRestApi/Translation";
import SDLMTLanguages from "../Model/Types/SDLMTLanguages";
import { authHeader } from "../_helpers/authHeader";
import { handleResponse } from "../_helpers/handleResponse";

export const translationService = {
  languages,
  sim,
  googlelanguages,
  googlesim,
};

async function languages() :Promise<SDLMTLanguages> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return await fetch(
    `${config.apiUrl}/translation/languages`,
    requestOptions
  ).then(handleResponse);
}

async function sim(id: number, to = "Eng", from = "Aut") : Promise<Translation> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return await fetch(
    `${config.apiUrl}/translation/sim?rowId=${id}&to=${to}&from=${from}`,
    requestOptions
  ).then(handleResponse);
}


async function googlelanguages() :Promise<Country[]> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return await fetch(
    `${config.apiUrl}/translation/googlelanguages`,
    requestOptions
  ).then(handleResponse);
}


async function googlesim(id: number, to:string) : Promise<Translation> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return await fetch(
    `${config.apiUrl}/translation/googlesim?rowId=${id}&to=${to}`,
    requestOptions
  ).then(handleResponse);
}
