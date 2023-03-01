import { CaseModel } from "../../Model/iTechRestApi/CaseModel";
import { UPDATED_SELECTED_CASE } from "../constants/Constants";
import { Action } from "./Action";

export const updateSelectedCaseAction = (value: CaseModel | undefined): Action => {
  return {
    type: UPDATED_SELECTED_CASE,
    payload: value,
  };
};
