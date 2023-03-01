import { Action } from "../actions/Action";
import { UPDATED_SELECTED_CASE } from "../constants/Constants";
import { StoreContextState } from "../types/StoreContextState";

const CaseReducer = (
  state: StoreContextState,
  action: Action
): StoreContextState => {
  const { type, payload } = action;

  switch (type) {
    case UPDATED_SELECTED_CASE:
      return {
        ...state,
        selectedCase: payload,
      };
    default:
      return state;
  }
};

export default CaseReducer;
