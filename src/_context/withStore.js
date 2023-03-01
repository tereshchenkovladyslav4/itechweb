import React from "react";
import { useStore } from "./Store";

function withStore(Component) {
  return function WrappedComponent(props) {
    const { dispatch, state, selectors } = useStore();
    return (
      <Component
        {...props}
        dispatch={dispatch}
        state={state}
        selectors={selectors}
      />
    );
  };
}

export default withStore;
