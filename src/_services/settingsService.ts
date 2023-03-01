import config from "../config";
import { BaseResponse } from "../Model/iTechRestApi/BaseResponse";
import { UserSettings } from "../Model/iTechRestApi/UserSettings";
import { authHeader } from "../_helpers/authHeader";
import { handleResponse } from "../_helpers/handleResponse";

export const settingsService = {
    get,
    put,
    updatePassword
};

function get() : Promise<UserSettings> {
    const requestOptions = { method: "GET", headers: authHeader() };
    return fetch(
        `${config.apiUrl}/api/Settings/`,
        requestOptions
    )
        .then(handleResponse);
}

function put(settings:UserSettings) : Promise<BaseResponse> {
    const requestOptions = { method: "PUT", headers: authHeader({ "Content-Type": "application/json" }), body: JSON.stringify(settings) };
    return fetch(
        `${config.apiUrl}/api/Settings/`,
        requestOptions
    )
    .then(handleResponse);
}

function updatePassword(password:string) : Promise<BaseResponse> {
    const requestOptions = { method: "PUT", headers: authHeader({ "Content-Type": "application/json" }), body: JSON.stringify(password) };
    return fetch(
        `${config.apiUrl}/api/Settings/changepassword/`,
        requestOptions
    )
    .then(handleResponse);
}