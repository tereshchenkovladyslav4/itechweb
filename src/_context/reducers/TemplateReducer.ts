import { Action } from "../actions/Action";
import { SET_TEMPLATES } from "../constants/Constants";
import { StoreContextState } from "../types/StoreContextState";

const TemplateReducer = (state: StoreContextState, action: Action): StoreContextState => {
  const { type, payload } = action;

  switch (type) {
    case SET_TEMPLATES:
      return {
        ...state,
        templates: payload,
      };
    default:
      return state;
  }
};

export default TemplateReducer;
