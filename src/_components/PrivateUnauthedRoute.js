import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useLocationBlocker } from "../_helpers/hooks/useLocationBlocker";

export const PrivateUnAuthedRoute = ({ component: Component, user: currentUserService, ...rest }) => {
  useLocationBlocker();

  return (
    <Route
      {...rest}
      render={(props) => {
        var user = currentUserService.currentUserValue;
        if (!user) {
          // not logged in so render login page with tenant route
          return <Component {...props} />
        } else {
          // shouldnt ever get here.. unless user specifically types a one part route when logged in
          return <Redirect to={{ pathname: "/", state: { from: props.location } }} />;
        }
      }}
    />
  );
};
