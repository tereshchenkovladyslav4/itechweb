import { authenticationService } from "../_services/authenticationService";
import { resetIdleTimer } from "./idleEvents";

// allowed errors is an optional array of status codes i.e. [404] for when dont want an error to be thrown
export function handleResponse(response: Response, allowedErrors: number[] = []): any {
  return response.text().then((text: string) => {
    const json = _isJson(text);
    const data = text && json.isJson && json.json;
    if (!json.isJson && text.length > 0) {
      console.error(text);
      return Promise.reject(text);
    } else if (!response.ok) {
      if ([401, 403].indexOf(response.status) !== -1) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        authenticationService.logout();
        window.location.reload();
      }
      if (allowedErrors && allowedErrors.indexOf(response.status) !== -1) {
        console.log("HandleResponse ignored error status: " + response.status);
        return Promise.resolve();
      }
      const error = (data && (data.message || data.error || data.detail || data.errors)) || response.statusText;
      return Promise.reject(error);
    }
    resetIdleTimer();
    return data;
  });
}

function _isJson(str: string) {
  try {
    return { json: JSON.parse(str), isJson: true };
  } catch (e) {
    return { json: null, isJson: false };
  }
}

export function handleFileDownload(rsp: Response): Promise<void> {
  return rsp
    .blob()
    .then((blob) => {
      return {
        blob: blob,
        filename: rsp.headers.get("Content-Disposition")?.split("filename=")[1]?.split(";")[0],
      };
    })
    .then(({ blob, filename }) => {
      const navigator: any = window.navigator;
      if (navigator && navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(blob);
        return;
      }

      const href = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = href;

      // set filename if we could access it
      if (filename) {
        link.download = filename;
      }

      document.body.appendChild(link);
      link.click();
      setTimeout(function () {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(href);
      }, 100);
    });
}
