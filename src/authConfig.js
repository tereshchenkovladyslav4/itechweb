import { PublicClientApplication } from "@azure/msal-browser";

const storageKey = "myMsalConfig";

const msalConfig = {
  auth: {}, // returned and populated from api
  cache: {
    cacheLocation: "localStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
};

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest = {
  scopes: ["User.Read"],
};

// use local storage so we can still detect if saml sign in when open another browser tab/window & sign out
export let myMsal = localStorage.getItem(storageKey) ? new PublicClientApplication( JSON.parse(localStorage.getItem(storageKey))) : null; //= new PublicClientApplication(msalConfig);
let accountId = "";

export const samlLogout = () => {
  // console.log("SSO LOGOUT: ", accountId);

  const result = myMsal.logoutRedirect({
    account: myMsal.getAccountByHomeId(accountId),
  });

  localStorage.removeItem(storageKey); // TODO - remove this.. or do we want this in localstorage anyway for multi tab login scenario

  return result;
};

function handleResponse(response) {

  if (response !== null) {
    accountId = response.account.homeAccountId;
    // console.log("Logged in username:", response.account.username);
    return response;
  
    // Display signed-in user content, call API, etc.
  } else {
    // In case multiple accounts exist, you can select
    const currentAccounts = myMsal.getAllAccounts();

    if (currentAccounts.length === 0) {
      // no accounts signed-in, assume a non sso user
    } else if (currentAccounts.length > 1) {
      // Add choose account code here
    } else if (currentAccounts.length === 1) {
      accountId = currentAccounts[0].homeAccountId;
      // if(window.location.href.endsWith("/msal")){
      //   window.location.href = window.location.href.replace("/msal", "/saml");
      // }
      return  currentAccounts[0];
    }
  }
}

export const loginSaml = async (config) => {
  // console.log("CALLING LOGINREDIRECT");
  
  msalConfig.auth = JSON.parse(config);

  myMsal = new PublicClientApplication(msalConfig);
  localStorage.setItem(storageKey, JSON.stringify(msalConfig));

  await myMsal.initialize();
  handleLogin();
  await myMsal.loginRedirect(loginRequest);
};

export const handleLogin = (setUser) => {
  // console.log("CALLING handleRedirectPromise");
  myMsal
    .handleRedirectPromise()
    .then(handleResponse)
    .then((rsp) => {
      if (rsp && setUser) {
        setUser(rsp?.account?.username || rsp.username);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
