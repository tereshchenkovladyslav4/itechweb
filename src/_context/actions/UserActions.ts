import { LOG_OUT_USER, SHOW_ERROR_DIALOG } from "../constants/Constants";
import { Action } from "./Action";

export const logOutUserAction = (): Action => {
  return {
    type: LOG_OUT_USER
  };
};

export const showErrorDialogAction = (error: any): Action => {
  return {
    type: SHOW_ERROR_DIALOG,
    payload: error,
  };
};
