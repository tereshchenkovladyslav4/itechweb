import config from "../config";
import { authHeader } from "../_helpers/authHeader";
import { handleResponse } from "../_helpers/handleResponse";
import {dataService} from "./dataService";
import { QuerySet } from "../Model/Types/QuerySet";
import { ITechWebResultSet } from "../Model/iTechRestApi/ITechWebResultSet";
import { ITechResultSet } from "../Model/iTechRestApi/ITechResultSet";

export const resultsService = {
    get,
    update,
    add,
    getAll,
    saveAllChecked,
    remove
};

async function get(id: number) {
    const requestOptions = { method: "GET", headers: authHeader() };
    return await fetch(
        `${config.apiUrl}/api/iTechDataWebResults/${id}`,
        requestOptions
    ).then(handleResponse);
}

async function getAll(): Promise<ITechResultSet[]>  {
    const requestOptions = { method: "GET", headers: authHeader() };
    return await fetch(
        `${config.apiUrl}/api/iTechDataWebResults/`,
        requestOptions
    ).then(handleResponse);
}

async function update(id: number, result: ITechWebResultSet) : Promise<void>{
    const requestOptions = {
        method: "PUT",
        headers: authHeader({ "Content-Type": "application/json" }),
        body: JSON.stringify(result),
    };
    return await fetch(
        `${config.apiUrl}/api/iTechDataWebResults/${id}`,
        requestOptions
    ).then(handleResponse);
}

async function add(result: ITechWebResultSet) : Promise<ITechWebResultSet>{
    const requestOptions = {
        method: "POST",
        headers: authHeader({ "Content-Type": "application/json" }),
        body: JSON.stringify(result),
    };
    return await fetch(
        `${config.apiUrl}/api/iTechDataWebResults`,
        requestOptions
    ).then(handleResponse);
}

// add or update with the results set containing items DESELECTED
async function saveAllChecked(results: ITechWebResultSet, query: QuerySet) : Promise<ITechWebResultSet> {
    const expressions = dataService.convertDurationExpression(query.expressions);

    const params = {
        results,
        expressions
    }
    const requestOptions = {
        method: "POST",
        headers: authHeader({ "Content-Type": "application/json" }),
        body: JSON.stringify(params),
    };
    return await fetch(
        `${config.apiUrl}/api/iTechDataWebResults/allChecked?search=${query.searchText}`,
        requestOptions
    ).then(handleResponse);
}

async function remove(id: number) : Promise<void>{
    const requestOptions = {
        method: "DELETE",
        headers: authHeader({ "Content-Type": "application/json" })
    };
    return await fetch(
        `${config.apiUrl}/api/iTechDataWebResults/${id}`,
        requestOptions
    ).then(handleResponse);
}


  