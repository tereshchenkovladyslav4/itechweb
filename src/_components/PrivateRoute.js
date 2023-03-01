import React from "react";
import { Route, Redirect } from "react-router-dom";
import UserIdle from "./UserIdle";
import { authenticationService } from "../_services/authenticationService";
import config from "../config";
import { useLocationBlocker } from "../_helpers/hooks/useLocationBlocker";
import { UserType } from "../Model/iTechRestApi/AuthenticateResponse";
import CaseRedirect from "../CaseRedirect";

export const PrivateRoute = ({ component: Component, user: currentUserService, ...rest }) => {
  useLocationBlocker();

  return (
    <Route
      {...rest}
      render={(props) => {
        var user = currentUserService.currentUserValue;
        if (user?.userType !== UserType.internal) {
          authenticationService.logout();
          return <Redirect to={{ pathname: "/login", state: { from: props.location } }} />;
        }
        if (!user) {
          // not logged in so redirect to login page with the return url
          return <Redirect to={{ pathname: "/login", state: { from: props.location } }} />;
        }
        if (
          (user.dualAuthenticationEmail || user.dualAuthenticationSms) &&
          !user.dualAuthenticated &&
          config.adminEnabled
        ) {
          // requires dual auth
          return <Redirect to={{ pathname: "/dualAuth", state: { from: props.location } }} />;
        }
        if (!user.dateChallenged && config.adminEnabled) {
          // requires challenge question
          return <Redirect to={{ pathname: "/challenge", state: { from: props.location } }} />;
        }

        const paths = props.location?.pathname?.split("/").filter((x) => x.length > 0);
        // this is here just for when cases are clicked from casemanagement virtualtable as it does not have the folder hierarchy
        if (paths?.length === 2 && paths[0] === "cases") {
          return <CaseRedirect {...props} />;
        }

        // authorised so return component
        return (
          <>
            <UserIdle
              logout={authenticationService.logout}
              userTimeout={currentUserService.currentUserValue.idleTimeout}
            />
            <Component {...props} />
          </>
        );
      }}
    />
  );
};
