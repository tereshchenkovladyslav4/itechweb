import config from "../config";
import { AddAlternativePhrase } from "../Model/iTechRestApi/AddAlternativePhrase";
import { ITechDataLexicon } from "../Model/iTechRestApi/ITechDataLexicon";
import { Lexicon } from "../Model/iTechRestApi/Lexicon";
import { ResultSet } from "../Model/iTechRestApi/ResultSet";
import { authHeader } from "../_helpers/authHeader";
import { handleResponse } from "../_helpers/handleResponse";

export const lexiconService = {
  get,
  addReferences,
  remove,
  removeReferences,
  search,
  add,
  update,
  deleteLexicons,
  getLexicon,
  getAlternatives,
  addAlternative,
};

function search(text: string): Promise<ResultSet<ITechDataLexicon>> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(`${config.apiUrl}/api/iTechWebLexicon/search?text=${text}`, requestOptions)
    .then(handleResponse)
    .then((response: ResultSet<ITechDataLexicon>) => {
      return response;
    });
}

async function get(id: number | string): Promise<ITechDataLexicon> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return await fetch(`${config.apiUrl}/api/iTechWebLexicon/${id}`, requestOptions).then(
    handleResponse
  );
}

async function getLexicon(id: number | string): Promise<Lexicon> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return await fetch(`${config.apiUrl}/api/iTechWebLexicon/lexicon/${id}`, requestOptions).then(
    handleResponse
  );
}

// async function remove(id: number): Promise<ITechDataLexicon> {
//   const requestOptions = { method: "DELETE", headers: authHeader() };
//   return await fetch(`${config.apiUrl}/api/iTechWebLexicon/${id}`, requestOptions).then(
//     handleResponse
//   );
// }

async function remove(gids: (string | number | undefined)[]): Promise<number> {
  const requestOptions = {
    method: "DELETE",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(gids),
  };
  return await fetch(`${config.apiUrl}/api/iTechWebLexicon/`, requestOptions).then(handleResponse);
}

async function add(lexicon: Lexicon): Promise<ITechDataLexicon> {
  const requestOptions = {
    method: "POST",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(lexicon),
  };
  return await fetch(`${config.apiUrl}/api/iTechWebLexicon`, requestOptions).then(handleResponse);
}

async function update(lexicon: Lexicon): Promise<void> {
  const requestOptions = {
    method: "PATCH",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(lexicon),
  };
  return await fetch(`${config.apiUrl}/api/iTechWebLexicon/${lexicon.gid}`, requestOptions).then(
    handleResponse
  );
}

async function addReferences(lexiconRowId: string | number, ids: number[]): Promise<number> {
  const requestOptions = {
    method: "POST",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(ids),
  };
  return await fetch(
    `${config.apiUrl}/api/iTechWebLexicon/references/${lexiconRowId}`,
    requestOptions
  ).then(handleResponse);
}

async function removeReferences(lexiconRowId: string | number, ids: number[]): Promise<number> {
  const requestOptions = {
    method: "DELETE",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(ids),
  };
  return await fetch(
    `${config.apiUrl}/api/iTechWebLexicon/references/${lexiconRowId}`,
    requestOptions
  ).then(handleResponse);
}

export type LexiconResult = {
  count: number;
  lexicons: string[] | null;
};

async function deleteLexicons(ids: (string | number | undefined)[]): Promise<LexiconResult> {
  const requestOptions = {
    method: "DELETE",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(ids),
  };
  return await fetch(`${config.apiUrl}/api/iTechWebLexicon`, requestOptions)
    .then(handleResponse)
    .then((res) => ({ count: res.item1, lexicons: res.item2 }));
}

async function getAlternatives(phrase: string): Promise<ResultSet<ITechDataLexicon>> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return await fetch(
    `${config.apiUrl}/api/iTechWebLexicon/alternatives?text=${phrase}`,
    requestOptions
  ).then(handleResponse);
}

async function addAlternative(
  phrase: string,
  alternativeText: string
): Promise<ResultSet<ITechDataLexicon>> {
  const requestOptions = {
    method: "POST",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify({ phrase: phrase, alternative: alternativeText } as AddAlternativePhrase),
  };
  return await fetch(`${config.apiUrl}/api/iTechWebLexicon/alternative`, requestOptions).then(
    handleResponse
  );
}
