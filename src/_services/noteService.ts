import config from "../config";
import { CaseNotes } from "../Model/iTechRestApi/CaseNotes";
import { ITechResultSet } from "../Model/iTechRestApi/ITechResultSet";
import { NoteLinkType } from "../Model/iTechRestApi/NoteLinkType";
import { NoteModel } from "../Model/iTechRestApi/NoteModel";
import { authHeader } from "../_helpers/authHeader";
import { handleResponse } from "../_helpers/handleResponse";

export const noteService = {
    getAll,
    get,
    getLinkedNotes,
    remove,
    add,
    addLinkedNote,
    update,
    getCaseFilesWithNotes
};

async function getAll(): Promise<ITechResultSet[]> {
    const requestOptions = { method: "GET", headers: authHeader() };
    return await fetch(`${config.apiUrl}/api/iTechDataNote`, requestOptions)
        .then(handleResponse);
}

async function get(id: number): Promise<NoteModel> {
    const requestOptions = { method: "GET", headers: authHeader() };
    return await fetch(`${config.apiUrl}/api/iTechDataNote/${id}`, requestOptions)
        .then(handleResponse);
}

async function getLinkedNotes(id:number, linkType: NoteLinkType): Promise<NoteModel[]> {
    const requestOptions = { method: "GET", headers: authHeader() };
    return await fetch(`${config.apiUrl}/api/iTechDataNote/${linkType}/${id}`, requestOptions)
        .then((response) => handleResponse(response, [404]));
}

async function getCaseFilesWithNotes(caseId:number): Promise<CaseNotes[]> {
    const requestOptions = { method: "GET", headers: authHeader() };
    return await fetch(`${config.apiUrl}/api/iTechDataNote/case/${caseId}`, requestOptions)
        .then(handleResponse);
}

// add a note - not linked
async function add(data: NoteModel): Promise<NoteModel> {
    const requestOptions = {
        method: "POST",
        headers: authHeader({ "Content-Type": "application/json" }),
        body: JSON.stringify(data),
    };
    return await fetch(
        `${config.apiUrl}/api/iTechDataNote`,
        requestOptions
    ).then(handleResponse);
}

async function addLinkedNote(id:number, linkType: NoteLinkType, data: NoteModel): Promise<NoteModel> {
    const requestOptions = {
        method: "POST",
        headers: authHeader({ "Content-Type": "application/json" }),
        body: JSON.stringify(data),
    };
    return await fetch(
        `${config.apiUrl}/api/iTechDataNote/${linkType}/${id}`,
        requestOptions
    ).then(handleResponse);
}

async function update(id: number, data: NoteModel): Promise<boolean> {
    const requestOptions = {
        method: "PUT",
        headers: authHeader({ "Content-Type": "application/json" }),
        body: JSON.stringify(data),
    };
    return await fetch(
        `${config.apiUrl}/api/iTechDataNote/${id}`,
        requestOptions
    ).then(handleResponse);
}

async function remove(id: number): Promise<void> {
    const requestOptions = {
        method: "DELETE",
        headers: authHeader({ "Content-Type": "application/json" })
    };
    return await fetch(
        `${config.apiUrl}/api/iTechDataNote/${id}`,
        requestOptions
    ).then(handleResponse);
}