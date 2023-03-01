import { SHOW_ERROR_DIALOG, CLOSE_ERROR_DIALOG } from "../constants/Constants";
import { IErrorData, StoreContextState } from "../types/StoreContextState";
import InitialState from "../types/initialState";
import { Action } from "../actions/Action";

const handleErrorReducer = (state: StoreContextState, action: Action): StoreContextState => {
  const { type, payload } = action;

  switch (type) {

    case SHOW_ERROR_DIALOG: {
      const newErrorData: IErrorData = {
        showDialog: true,
        componentName: payload.componentName,
        error: payload.error,
        errorInfo: payload.errorInfo
      }
      return {
        ...state,
        errorData: newErrorData,
        showHidden:false, // clear any fullscreen state on an error too
      };
    }
    case CLOSE_ERROR_DIALOG: {
      const initialErrorState: IErrorData = {
        ...InitialState.errorData
      }
      return {
        ...state,
        errorData: initialErrorState
      };
    }
    default:
      return state;
  }
};

export default handleErrorReducer;
