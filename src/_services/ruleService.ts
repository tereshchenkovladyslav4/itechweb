import config from "../config";
import { RuleTaskExtended } from "../Model/Extended/RuleTaskExtended";
import { ITechDataRule } from "../Model/iTechRestApi/ITechDataRule";
import { RuleTask } from "../Model/iTechRestApi/RuleTask";
import { authHeader } from "../_helpers/authHeader";
import { handleResponse } from "../_helpers/handleResponse";

export const ruleService = {
  add,
  update,
  get,
  remove,
  search,
};

function get(gid: number | string): Promise<RuleTask> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(`${config.apiUrl}/api/iTechWebRule/data/${gid}`, requestOptions).then(
    handleResponse
  );
}

function search(text: string): Promise<RuleTask[]> {
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(`${config.apiUrl}/api/iTechWebRule/search?text=${text}`, requestOptions)
    .then(handleResponse)
    .then((response: RuleTask[]) => {
      return response;
    });
}

async function remove(gids: (string | number | undefined)[]): Promise<number> {
  const requestOptions = {
    method: "DELETE",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(gids),
  };
  return await fetch(`${config.apiUrl}/api/iTechWebRule/`, requestOptions).then(handleResponse);
}

async function add(rule: RuleTaskExtended): Promise<ITechDataRule> {
  rule.filterJSON = JSON.stringify(rule.filters);

  const requestOptions = {
    method: "POST",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(rule),
  };

  const url = new URL(`${config.apiUrl}/api/iTechWebRule`);
  return fetch(url.toString(), requestOptions).then(handleResponse);
}

async function update(surveillance: RuleTaskExtended): Promise<void> {
  surveillance.filterJSON = JSON.stringify(surveillance.filters);

  const requestOptions = {
    method: "PATCH",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(surveillance),
  };
  return await fetch(
    `${config.apiUrl}/api/iTechWebRule/${surveillance.rowId}`,
    requestOptions
  ).then(handleResponse);
}
