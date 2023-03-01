import { SHOW_HIDDEN } from "../constants/Constants";
import { Action } from "./Action";


export const showHiddenAction = (show: boolean): Action => {
  return {
    type: SHOW_HIDDEN,
    payload: show,
  };
};
