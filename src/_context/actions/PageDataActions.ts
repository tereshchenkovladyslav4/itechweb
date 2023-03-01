import {
  UPDATE_VERSION,
  UPDATE_GRID_ROW,
  APPLY_FILTERS,
  APPLY_TREE_FILTERS,
  APPLY_GRAPH_FILTERS,
  REMOVE_FILTERS,
  REMOVE_TREE_FILTERS,
  REMOVE_GRAPH_FILTERS,
  REMOVE_TAB_FILTERS,
} from "../constants/Constants";

import { AdvancedFilterModel } from "../../Model/iTechRestApi/AdvancedFilterModel";
import { Action } from "./Action";
import { TableEnum } from "../../Model/iTechRestApi/TableEnum";
import { FilterGroup } from "../../Model/Types/FilterGroup";

export const updateGridRowAction = (value: any): Action => {
  return {
    type: UPDATE_GRID_ROW,
    payload: value,
  };
};

export const updateVersionAction = (value: any): Action => {
  return {
    type: UPDATE_VERSION,
    payload: value,
  };
};

export const applyFiltersAction = (
  value: AdvancedFilterModel | undefined,
  group: FilterGroup = FilterGroup.None
): Action => {
  return {
    type: APPLY_FILTERS,
    payload: { value, group },
  };
};

export const applyTreeFiltersAction = (
  value: AdvancedFilterModel | undefined,
  group: FilterGroup = FilterGroup.None
): Action => {
  return {
    type: APPLY_TREE_FILTERS,
    payload: { value, group },
  };
};

export const applyGraphFiltersAction = (
  value: AdvancedFilterModel | undefined,
  group: FilterGroup = FilterGroup.None
): Action => {
  return {
    type: APPLY_GRAPH_FILTERS,
    payload: { value, group },
  };
};

export const removeTabFiltersAction = (value?: number): Action => {
  return {
    type: REMOVE_TAB_FILTERS,
    payload: value,
  };
};

// These 3 actions are unused - redundant now that components persist their applied filters
// removeFiltersAction, removeTreeFiltersAction, removeGraphFiltersAction
export const removeFiltersAction = (value: TableEnum, group: FilterGroup = FilterGroup.None): Action => {
  return {
    type: REMOVE_FILTERS,
    payload: { value, group },
  };
};

export const removeTreeFiltersAction = (value: TableEnum, group: FilterGroup = FilterGroup.None): Action => {
  return {
    type: REMOVE_TREE_FILTERS,
    payload: { value, group },
  };
};

export const removeGraphFiltersAction = (value?: TableEnum, group: FilterGroup = FilterGroup.None): Action => {
  return {
    type: REMOVE_GRAPH_FILTERS,
    payload: { value, group },
  };
};
