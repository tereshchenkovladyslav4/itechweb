import { SET_TEMPLATES } from "../constants/Constants";
import { Action } from "./Action";

export const setTemplatesAction = (value: any): Action  => {
  return {
    type: SET_TEMPLATES,
    payload: value,
  };
};
