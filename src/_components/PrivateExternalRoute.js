import React from "react";
import { Route, Redirect } from "react-router-dom";
import UserIdle from "./UserIdle";
import { authenticationService } from "../_services/authenticationService";
import { useLocationBlocker } from "../_helpers/hooks/useLocationBlocker";

export const PrivateExternalRoute = ({
  component: Component,
  user: currentUserService,
  ...rest
}) => {
  useLocationBlocker();

  return (
    <Route
      {...rest}
      render={(props) => {
        var user = currentUserService.currentUserValue;
        if (!user) {
          // not logged in so redirect to page to confirm requesting access with the return url
          return <Redirect to={{ pathname: "/requestaccess", state: { from: props.location } }} />;
        }
        if (
          (user.dualAuthenticationEmail || user.dualAuthenticationSms) &&
          !user.dualAuthenticated
          // && config.adminEnabled
        ) {
          // requires dual auth
          return <Redirect to={{ pathname: "/dualAuth", state: { from: props.location } }} />;
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
