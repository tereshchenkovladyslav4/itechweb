import config from '../config'
// import { CounterLinkType } from '../Model/iTechRestApi/CounterLinkType';
// import { Filter } from '../Model/iTechRestApi/Filter';
import { ITechDataWebFilter } from '../Model/iTechRestApi/ITechDataWebFilter'
import { ITechDataWebFilterWithUser } from '../Model/iTechRestApi/ITechDataWebFilterWithUser';
import { authHeader } from '../_helpers/authHeader'
import { handleResponse } from '../_helpers/handleResponse'

export const filterService = {
    get,
    update,
    add,
    getAll,
    // getCount,
    // getLinkedCount
};

async function get(id: number): Promise<ITechDataWebFilter> {
    const requestOptions = { method: "GET", headers: authHeader() };
    return await fetch(
        `${config.apiUrl}/api/iTechDataWebFilter/${id}`,
        requestOptions
    ).then(handleResponse);
}

async function getAll(): Promise<ITechDataWebFilterWithUser[]> {
    const requestOptions = { method: "GET", headers: authHeader() };
    return await fetch(
        `${config.apiUrl}/api/iTechDataWebFilter/`,
        requestOptions
    ).then(handleResponse);
}

function update(id: number, filter: ITechDataWebFilter): Promise<void> {
    const requestOptions = {
        method: "PUT",
        headers: authHeader({ "Content-Type": "application/json" }),
        body: JSON.stringify(filter),
    };
    return fetch(
        `${config.apiUrl}/api/iTechDataWebFilter/${id}`,
        requestOptions
    ).then(handleResponse);
}

function add(filter: ITechDataWebFilter): Promise<ITechDataWebFilterWithUser> {
    const requestOptions = {
        method: "POST",
        headers: authHeader({ "Content-Type": "application/json" }),
        body: JSON.stringify(filter),
    };
    return fetch(
        `${config.apiUrl}/api/iTechDataWebFilter`,
        requestOptions
    ).then(handleResponse);
}


// async function getCount(id: number, isPercentage:boolean, filters: Filter[], divisorId?:number): Promise<number> {
//     const requestOptions = { method: "GET", headers: authHeader() };
//     const url = new URL(`${config.apiUrl}/api/iTechDataWebCounter/${id}/${isPercentage}`);
//     if(isPercentage && divisorId !== undefined && divisorId !== -1){
//         url.searchParams.append("divisor", divisorId.toString());
//     }
//     const expressions = filters ? [{ rule: "AND", filters: filters }] : null;
//     const expressionsJson = JSON.stringify(expressions);
//     url.searchParams.append("expressions", expressionsJson);

//     return await fetch(
//        url.href,
//         requestOptions
//     ).then(handleResponse);
// }

// async function getLinkedCount(linkType:CounterLinkType, linkId:number, id: number, isPercentage:boolean, filters: Filter[], divisorId?:number): Promise<number> {
//     const requestOptions = { method: "GET", headers: authHeader() };
//     const url = new URL(`${config.apiUrl}/api/iTechDataWebCounter/${linkType}/${linkId}/${id}/${isPercentage}`);
//     if(isPercentage && divisorId !== undefined && divisorId !== -1){
//         url.searchParams.append("divisor", divisorId.toString());
//     }

//     const expressions = filters ? [{ rule: "AND", filters: filters }] : null;
//     const expressionsJson = JSON.stringify(expressions);
//     url.searchParams.append("expressions", expressionsJson);

//     return await fetch(
//         url.href,
//         requestOptions
//     ).then(handleResponse);
// }