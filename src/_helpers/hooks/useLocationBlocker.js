import { useHistory } from "react-router-dom";
import { useEffect } from "react";

// prevent duplicate routes being pushed to history
export function useLocationBlocker(){
  const history = useHistory();
  useEffect(
    () =>
      history.block(
        (location, action) =>
          action !== "PUSH" ||
          getLocationId(location) !== getLocationId(history.location)
      ),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );
}

function getLocationId({ pathname, search, hash }) {
  return pathname + (search ? "?" + search : "") + (hash ? "#" + hash : "");
}