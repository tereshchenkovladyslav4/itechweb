import { authenticationService } from "../_services/authenticationService";

export function authHeader(headers) {
  // return authorization header with jwt token
  const currentUser = authenticationService.currentUserValue;
  if (currentUser && currentUser.token) {
    let h = { Authorization: `Bearer ${currentUser.token}`, ...headers };

    const caseId = sessionStorage.getItem("caseId");
    if (caseId?.length) {
      h = { "X-Soteria-Case-Id": caseId, ...h };
    }

    // format is datasource:id
    const investigationId = sessionStorage.getItem("investigationId");
    if (investigationId?.length) {
      h = { "X-Soteria-Investigation-Id": investigationId, ...h };
    }

    return h;
  } else {
    return { ...headers };
  }
}

// export const getCaseHeader = () => {
//   const caseId = sessionStorage.getItem("caseId");
//   if (caseId?.length) {
//     return { "X-Soteria-Case-Id": caseId };
//   }
//   return {};
// };

// takes a url and if have an authed user adds access_token as a query param
export function authTokenQueryParam(url) {
  const currentUser = authenticationService.currentUserValue;
  if (currentUser && currentUser.token) {
    var newUrl = new URL(url);
    newUrl.searchParams.append("access_token", currentUser.token);
    return newUrl.href;
  }

  return url;
}
