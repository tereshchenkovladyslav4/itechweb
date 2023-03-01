export interface AuthenticateResponse {
  id: string;
  forename: string;
  surname: string;
  username: string;
  token: string;
  idleTimeout: number;
  dualAuthenticationEmail: boolean;
  dualAuthenticationSms: boolean;
  dualAuthenticated: boolean;
  dateChallenged: Date;
}
