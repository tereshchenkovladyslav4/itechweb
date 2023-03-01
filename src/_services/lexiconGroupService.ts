import config from "../config";
import { ITechWebLexiconGroup } from "../Model/iTechRestApi/ITechWebLexiconGroup";
import { LexiconGroup } from "../Model/iTechRestApi/LexiconGroup";
import { ResultSet } from "../Model/iTechRestApi/ResultSet";
import { authHeader } from "../_helpers/authHeader";
import { handleResponse } from "../_helpers/handleResponse";

export const lexiconGroupService = {
  get,
  addReferences,
  removeReferences,
  search,
  add,
  update,
  getLexiconGroup,
  deleteGroup,
  removeMany, // TODO: is API required?
};

async function get(id: number | string): Promise<ITechWebLexiconGroup> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return await fetch(`${config.apiUrl}/api/iTechWebLexiconGroup/${id}`, requestOptions).then(
    handleResponse
  );
}

async function getLexiconGroup(id: number | string): Promise<LexiconGroup> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return await fetch(`${config.apiUrl}/api/iTechWebLexiconGroup/group/${id}`, requestOptions).then(
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
    `${config.apiUrl}/api/iTechWebLexiconGroup/references/${lexiconRowId}`,
    requestOptions
  ).then(handleResponse);
}

async function removeReferences(
  lexiconRowId: string | number,
  ids: (string | number)[]
): Promise<number> {
  const requestOptions = {
    method: "DELETE",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(ids),
  };
  return await fetch(
    `${config.apiUrl}/api/iTechWebLexiconGroup/references/${lexiconRowId}`,
    requestOptions
  ).then(handleResponse);
}

async function deleteGroup(gid: string | number | undefined): Promise<ITechWebLexiconGroup> {
  const requestOptions = {
    method: "DELETE",
    headers: authHeader({ "Content-Type": "application/json" }),
  };
  return await fetch(`${config.apiUrl}/api/iTechWebLexiconGroup/${gid}`, requestOptions).then(
    handleResponse
  );
}

function search(text: string): Promise<ResultSet<ITechWebLexiconGroup>> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(
    `${config.apiUrl}/api/iTechWebLexiconGroup/search?text=${text}`,
    requestOptions
  ).then(handleResponse);
}

async function add(lexicon: LexiconGroup): Promise<number> {
  const requestOptions = {
    method: "POST",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(lexicon),
  };
  return await fetch(`${config.apiUrl}/api/iTechWebLexiconGroup`, requestOptions).then(
    handleResponse
  );
}

async function update(lexicon: LexiconGroup): Promise<number> {
  const requestOptions = {
    method: "PATCH",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(lexicon),
  };
  return await fetch(
    `${config.apiUrl}/api/iTechWebLexiconGroup/${lexicon.gid}`,
    requestOptions
  ).then(handleResponse);
}

async function removeMany(gids: (string | number | undefined)[]): Promise<number> {
  const requestOptions = {
    method: "DELETE",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(gids),
  };
  return await fetch(`${config.apiUrl}/api/iTechWebLexiconGroup/`, requestOptions).then(
    handleResponse
  );
}
