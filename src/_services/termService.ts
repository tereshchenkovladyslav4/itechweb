import config from "../config";
import { Area } from "../Model/iTechRestApi/Area";
import { DocumentTerm } from "../Model/iTechRestApi/DocumentTerm";
import { ITechDataTerm } from "../Model/iTechRestApi/ITechDataTerm";
import { ITechDataTermToTableReference } from "../Model/iTechRestApi/ITechDataTermToTableReference";
import { ICheckedSet } from "../Model/iTechRestApi/ICheckedSet";
import { ResultSet } from "../Model/iTechRestApi/ResultSet";
import { TermInfo } from "../Model/iTechRestApi/TermInfo";
import { authHeader } from "../_helpers/authHeader";
import { handleResponse } from "../_helpers/handleResponse";

export const termService = {
  get,
  add,
  addReferences,
  remove,
  removeReferences,
  allChecked,
  getDocumentTerms,
  deleteTerms,

  // related but different controller
  addArea,
  updateArea,
  deleteArea,
  unredactTerm,
  search,
};

function search(text: string): Promise<ResultSet<ITechDataTerm>> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(`${config.apiUrl}/api/iTechWebTerm/search?text=${text}`, requestOptions)
    .then(handleResponse)
    .then((response: ResultSet<ITechDataTerm>) => {
      return response;
    });
}

async function get(id: number): Promise<ITechDataTerm> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return await fetch(`${config.apiUrl}/api/iTechWebTerm/${id}`, requestOptions).then(
    handleResponse
  );
}

function add(term: ITechDataTerm, simRowId?: number, info?: TermInfo): Promise<ITechDataTerm> {
  const requestOptions = {
    method: "POST",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify({ item1: term, item2: info }),
  };

  const url = new URL(`${config.apiUrl}/api/iTechWebTerm`);
  if (simRowId) {
    url.searchParams.append("simId", simRowId.toString());
  }
  return fetch(url.toString(), requestOptions).then(handleResponse);
}

async function remove(id: number): Promise<ITechDataTerm> {
  const requestOptions = { method: "DELETE", headers: authHeader() };
  return await fetch(`${config.apiUrl}/api/iTechWebTerm/${id}`, requestOptions).then(
    handleResponse
  );
}

async function addReferences(ids: number[]): Promise<number> {
  const requestOptions = {
    method: "POST",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(ids),
  };
  return await fetch(`${config.apiUrl}/api/iTechWebTerm/references`, requestOptions).then(
    handleResponse
  );
}

async function removeReferences(ids: number[]): Promise<number> {
  const requestOptions = {
    method: "DELETE",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(ids),
  };
  return await fetch(`${config.apiUrl}/api/iTechWebTerm/references`, requestOptions).then(
    handleResponse
  );
}

async function deleteTerms(ids: number[]): Promise<TermResult> {
  const requestOptions = {
    method: "DELETE",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(ids),
  };
  return await fetch(`${config.apiUrl}/api/iTechWebTerm`, requestOptions)
    .then(handleResponse)
    .then((res) => ({ count: res.item1, terms: res.item2 }));
}

export type TermResult = {
  count: number;
  terms: string[] | null;
};

async function allChecked(checkedSet: ICheckedSet): Promise<TermResult> {
  const requestOptions = {
    method: "POST",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(checkedSet),
  };
  return await fetch(`${config.apiUrl}/api/iTechWebTerm/allChecked`, requestOptions)
    .then(handleResponse)
    .then((val) => ({ count: val.item1, terms: val.item2 }));
}

// N.B.. this is on iTechFsiController currently
async function getDocumentTerms(simId: number): Promise<DocumentTerm[]> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return await fetch(`${config.apiUrl}/api/iTechFsi/redactionTerms/${simId}`, requestOptions).then(
    handleResponse
  );
}

function addArea(area: Area, simRowId?: number, info?: TermInfo): Promise<Area> {
  const requestOptions = {
    method: "POST",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify({ area: area, termInfo: info }),
  };

  const url = new URL(`${config.apiUrl}/api/iTechDataArea`);
  if (simRowId) {
    url.searchParams.append("simId", simRowId.toString());
  }
  return fetch(url.toString(), requestOptions).then(handleResponse);
}

function updateArea(area: Area, simRowId?: number, info?: TermInfo): Promise<Area> {
  const requestOptions = {
    method: "PUT",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify({ area: area, termInfo: info }),
  };

  const url = new URL(`${config.apiUrl}/api/iTechDataArea`);
  if (simRowId) {
    url.searchParams.append("simId", simRowId.toString());
  }
  return fetch(url.toString(), requestOptions).then(handleResponse);
}

function deleteArea(areaId: number, simRowId: number): Promise<boolean> {
  const requestOptions = {
    method: "DELETE",
    headers: authHeader(),
  };

  const url = new URL(`${config.apiUrl}/api/iTechDataArea/${areaId}/${simRowId}`);

  return fetch(url.toString(), requestOptions).then(handleResponse);
}

function unredactTerm(termId: number, simRowId: number): Promise<ITechDataTermToTableReference> {
  const requestOptions = {
    method: "POST",
    headers: authHeader(),
  };

  const url = new URL(`${config.apiUrl}/api/iTechWebTerm/unredact/${termId}/${simRowId}`);

  return fetch(url.toString(), requestOptions).then(handleResponse);
}
