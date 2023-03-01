import { Action } from "../actions/Action";
import { UPDATE_DATASOURCES } from "../constants/Constants";
import { StoreContextState } from "../types/StoreContextState";

const DataSourceReducer = (state: StoreContextState, action: Action): StoreContextState => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_DATASOURCES:
      return {
        ...state,
        dataSources: payload,
      };
    default:
      return state;
  }
};

export default DataSourceReducer;
