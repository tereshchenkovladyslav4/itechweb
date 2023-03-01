import config from "../config";
import { handleResponse } from "../_helpers/handleResponse";
import FrontendError from "../Model/Types/FrontendError";

export const errorService = {
  sendError,
};

function sendError(error: FrontendError) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(error),
  };

  return fetch(`${config.apiUrl}/error/sendEmail`, requestOptions).then(
    handleResponse
  );
}
