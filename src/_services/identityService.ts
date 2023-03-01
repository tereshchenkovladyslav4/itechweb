import config from "../config";
import { handleResponse } from "../_helpers/handleResponse";

export const identityService = {
    verifyUser,
};

async function verifyUser(code:string):Promise<boolean> {
    //unauthed external user request
    const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(code),
      };
      return await fetch(
        `${config.apiUrl}/api/identity`,
        requestOptions
      ).then(handleResponse);
}