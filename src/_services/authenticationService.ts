import config from "../config";
import { BehaviorSubject } from "rxjs";
import { authHeader } from "../_helpers/authHeader";
import { handleResponse } from "../_helpers/handleResponse";
import ResetPasswordResponse from "../Model/Types/ResetPasswordResponse";
import ValidateReset from "../Model/Types/ValidateReset";
import ResetPassword from "../Model/Types/ResetPassword";
import { AuthenticateResponse } from "../Model/iTechRestApi/AuthenticateResponse";
import { myMsal, samlLogout } from "../authConfig";
import { AuthenticationType } from "../Model/iTechRestApi/AuthenticationType";

function getUser(): AuthenticateResponse | null {
  const user = localStorage.getItem("currentUser");
  if (user) return JSON.parse(user);
  return null;
}

const currentUserSubject = new BehaviorSubject<AuthenticateResponse | null>(getUser());

export const authenticationService = {
  login,
  loginSSO,
  authenticateByCase,
  logout,
  currentUser: currentUserSubject.asObservable(),
  get currentUserValue(): AuthenticateResponse | null {
    return currentUserSubject.value;
  },
  resetPassword,
  forgottenPassword,
  forgottenUsername,
  validateReset,
  updateTab,
  updateMenu,
  get currentUserId():number {
    if(currentUserSubject.value)
      return parseInt(currentUserSubject.value?.id.split("-")[1]);
    return -1;
  },
  getUserAuthType,
  getTenantConfig,
};

function authenticate(response: AuthenticateResponse) {
  // store user details and jwt token in local storage to keep user logged in between page refreshes
  localStorage.setItem("currentUser", JSON.stringify(response));
  currentUserSubject.next(response);
  return response;
}

function updateTab(tabRowId: number): void {
  // const updatedUser = currentUserSubject.value;
  const user = localStorage.getItem("currentUser");
  let updatedUser;
  if(user){
    updatedUser =JSON.parse(user);
  }
  if (updatedUser) updatedUser.authenticatedUser.iTechDataWebTabRowId = tabRowId;
  localStorage.setItem("currentUser", JSON.stringify(updatedUser));
  currentUserSubject.next(updatedUser);
}

function updateMenu(menuRowId: number): void {
  // const updatedUser = currentUserSubject.value;
  const user = localStorage.getItem("currentUser");
  let updatedUser;
  if(user){
    updatedUser =JSON.parse(user);
  }
  if (updatedUser) updatedUser.authenticatedUser.iTechDataWebMenuRowId = menuRowId;
  localStorage.setItem("currentUser", JSON.stringify(updatedUser));
  currentUserSubject.next(updatedUser);
}

function login(username: string, password: string): Promise<AuthenticateResponse> {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  };

  return fetch(`${config.apiUrl}/users/authenticate`, requestOptions)
    .then(handleResponse)
    .then(authenticate);
}

function loginSSO(username: string): Promise<AuthenticateResponse> {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  };

  return fetch(`${config.apiUrl}/users/authenticateToken`, requestOptions)
    .then(handleResponse)
    .then(authenticate);
}

function getUserAuthType(username: string): Promise<AuthenticationType>{
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  };

  return fetch(`${config.apiUrl}/users/authenticationType`, requestOptions)
    .then(handleResponse);
}

function getTenantConfig(tenant: string): Promise<AuthenticationType>{
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tenant }),
  };

  return fetch(`${config.apiUrl}/users/authenticationConfig`, requestOptions)
    .then(handleResponse);
}

function authenticateByCase(caseId: number): Promise<AuthenticateResponse> {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  };

  return fetch(`${config.apiUrl}/users/authenticate/${caseId}`, requestOptions)
    .then(handleResponse)
    .then(authenticate);
}

function logout(): void {
  const requestOptions = { method: "GET", headers: authHeader() };
  fetch(`${config.apiUrl}/users/logout`, requestOptions);
  // remove user from local storage to log user out
  localStorage.removeItem("currentUser");
  document.title = config.display || "";
  currentUserSubject.next(null);
  const t = myMsal;
  const currentAccounts = t?.getAllAccounts();
  const isAuthenticated = (currentAccounts?.length || 0 ) > 0;
  if (isAuthenticated) {
    samlLogout();
  }
}

function forgottenPassword(email: string): Promise<any> {
  const requestOptions = { method: "GET", headers: authHeader() };

  return fetch(`${config.apiUrl}/users/forgottenPassword?identifier=${email}`, requestOptions).then(
    handleResponse
  );
}

function validateReset(token: string): Promise<ValidateReset> {
  const requestOptions = { method: "GET", headers: authHeader() };

  return fetch(`${config.apiUrl}/users/validateReset?token=${token}`, requestOptions)
    .then(handleResponse)
    .then((response: ValidateReset) => {
      return response;
    });
}

function resetPassword(resetPassword: ResetPassword): Promise<ResetPasswordResponse> {
  const requestOptions = {
    method: "POST",
    headers: authHeader({ "Content-Type": "application/json" }),
    body: JSON.stringify(resetPassword),
  };

  return fetch(`${config.apiUrl}/users/resetPassword`, requestOptions)
    .then(handleResponse)
    .then((response: ResetPasswordResponse) => {
      if (response.authenticateResponse) {
        authenticate(response.authenticateResponse);
      }
      return response;
    });
}

function forgottenUsername(email: string): Promise<any> {
  const requestOptions = { method: "GET", headers: authHeader() };

  return fetch(`${config.apiUrl}/users/forgottenUsername?identifier=${email}`, requestOptions).then(
    handleResponse
  );
}
