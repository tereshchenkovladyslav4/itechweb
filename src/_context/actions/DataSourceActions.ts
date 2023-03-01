import { ITechControlTable } from "../../Model/iTechRestApi/ITechControlTable";
import { UPDATE_DATASOURCES } from "../constants/Constants";
import { Action } from "./Action";

export const updateDataSourcesAction = (
  value: Array<ITechControlTable>
): Action => {
  return {
    type: UPDATE_DATASOURCES,
    payload: value,
  };
};

