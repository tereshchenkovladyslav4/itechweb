import { LOG_OUT_USER } from "../constants/Constants";
import { StoreContextState } from "../types/StoreContextState";
import InitialState from "../types/initialState";
import { Action } from "../actions/Action";

const UserReducer = (state: StoreContextState, action: Action): StoreContextState => {
  const { type } = action;
  switch (type) {
    case LOG_OUT_USER: {
      return InitialState;
    }
    default:
      return state;
  }
};

export default UserReducer;
