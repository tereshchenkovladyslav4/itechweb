import { SHOW_HIDDEN } from "../constants/Constants";
import { StoreContextState } from "../types/StoreContextState";
import { Action } from "../actions/Action";

const hiddenReducer = (state: StoreContextState, action: Action): StoreContextState => {
  const { type, payload } = action;

  switch (type) {

    case SHOW_HIDDEN: {
     
      return {
        ...state,
        showHidden: payload
      };
    }
   
    default:
      return state;
  }
};

export default hiddenReducer;
