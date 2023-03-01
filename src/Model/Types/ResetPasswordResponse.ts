import { AuthenticateResponse } from "../iTechRestApi/AuthenticateResponse";

export default interface ResetPasswordResponse {
  error: string;
  validUrls: string;
  response: string;
  cancelRequest: boolean;
  authenticateResponse: AuthenticateResponse;
}
