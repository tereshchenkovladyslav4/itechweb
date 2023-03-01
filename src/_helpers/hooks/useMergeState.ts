import { Dispatch, SetStateAction, useState } from "react";

export { useMergeState };

/**
 * Hook to allow combining of state variables into single object.
 * Can set a part of object state in setState call and it merges into current state
 */
function useMergeState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<Partial<S>>>] {
  const [state, setState] = useState(initialState);
  const setMergedState = (newState: any) =>
    setState((prevState: S) => Object.assign({}, prevState, newState));
  return [state, setMergedState];
}
