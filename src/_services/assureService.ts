import config from "../config";
import { AssureReport } from "../Model/iTechRestApi/TableModel";
import { authHeader } from "../_helpers/authHeader";
import { handleResponse } from "../_helpers/handleResponse";

export const assureService = {
    get,
}


async function get(date: string): Promise<AssureReport> {
    const requestOptions = { method: "GET", headers: authHeader() };
    const url = new URL(`${config.apiUrl}/api/iTechWebReportingAssure/report`);

    url.searchParams.append("date", date);
    
    return await fetch(url.href, requestOptions)
      .then(handleResponse);
}