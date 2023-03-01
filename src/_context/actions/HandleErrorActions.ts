import { SHOW_ERROR_DIALOG, CLOSE_ERROR_DIALOG } from "../constants/Constants";
import { Action } from "./Action";

export const showErrorDialogAction = (componentName: string | undefined, error: any, errorInfo: any = ""): Action => {
  const payload = {
    componentName: componentName,
    error: error,
    errorInfo: errorInfo
  };

  return {
    type: SHOW_ERROR_DIALOG,
    payload: payload,
  };
};

export const closeErrorDialogAction = (): Action => {
  return {
    type: CLOSE_ERROR_DIALOG
  };
};
