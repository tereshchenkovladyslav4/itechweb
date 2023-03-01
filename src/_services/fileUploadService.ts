import config from "../config";
import { authHeader } from "../_helpers/authHeader";
import { handleResponse } from "../_helpers/handleResponse";

export const fileUploadService = {
    upload,
};

async function upload(files: File[]): Promise<any> {
    const formData = new FormData();
    files.forEach(x => formData.append("files", x));

    const requestOptions = {
      method: "POST",
      headers: authHeader(),
      body: formData,
    };
    return await fetch(
      `${config.apiUrl}/api/FileUpload`,
      requestOptions
    ).then(handleResponse);
  }
  
  