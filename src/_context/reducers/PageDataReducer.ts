import { AdvancedFilterModel } from "../../Model/iTechRestApi/AdvancedFilterModel";
import { TableEnum } from "../../Model/iTechRestApi/TableEnum";
import { FilterGroup } from "../../Model/Types/FilterGroup";
import { Action } from "../actions/Action";
import {
  UPDATE_GRID_ROW,
  APPLY_FILTERS,
  APPLY_TREE_FILTERS,
  APPLY_GRAPH_FILTERS,
  REMOVE_FILTERS,
  REMOVE_TREE_FILTERS,
  REMOVE_GRAPH_FILTERS,
  UPDATE_VERSION,
  REMOVE_TAB_FILTERS,
} from "../constants/Constants";
import { getSelectedTabId } from "../selectors/useSelectors";
import { GroupFilters, PageDataType, StoreContextState } from "../types/StoreContextState";
import _ from "lodash";

const pageDataReducer = (state: StoreContextState, action: Action): StoreContextState => {
  const { type, payload } = action;

  const selectedTabId = getSelectedTabId(state);
  if (!selectedTabId) return state;
  switch (type) {
    case REMOVE_TAB_FILTERS:{
      // just remove the filters from the given tabId or the current tab
      const tabId = payload || selectedTabId;
      const currState = state.pageData?.get(tabId);
      return {
        ...state,
        pageData: state.pageData?.set(tabId, {
          ...currState,
          appliedFilters: undefined,
          appliedTreeFilters:undefined,
          appliedGraphFilters:undefined
        } as PageDataType),
      }
    }
    case UPDATE_GRID_ROW:
      return {
        ...state,
        pageData: state.pageData?.set(selectedTabId, {
          ...state.pageData?.get(selectedTabId),
          data: payload,
          selectedVersion: undefined,
        } as PageDataType),
      };
    case UPDATE_VERSION:
      return {
        ...state,
        pageData: state.pageData?.set(selectedTabId, {
          ...state.pageData?.get(selectedTabId),
          selectedVersion: payload,
        } as PageDataType),
      };
    case APPLY_FILTERS: {
      const currState = state.pageData?.get(selectedTabId);
      if(currState && !currState?.appliedFilters){
        currState.appliedFilters = new Map<FilterGroup, AdvancedFilterModel>();
      }
      return {
        ...state,
        pageData: state.pageData?.set(selectedTabId, {
          ...currState,
          appliedFilters: currState?.appliedFilters?.set(payload.group, payload.value),
        } as PageDataType),
      };
    }
    case APPLY_TREE_FILTERS: {
      const currState = state.pageData?.get(selectedTabId);
      if(currState && !currState?.appliedTreeFilters){
        currState.appliedTreeFilters = new Map<FilterGroup, AdvancedFilterModel>();
      }
      return {
        ...state,
        pageData: state.pageData?.set(selectedTabId, {
          ...currState,
          appliedTreeFilters: currState?.appliedTreeFilters?.set(payload.group, payload.value),
        } as PageDataType),
      };
    }
    case APPLY_GRAPH_FILTERS:
      {
      const currState = state.pageData?.get(selectedTabId);
      if(currState && !currState?.appliedGraphFilters){
        currState.appliedGraphFilters = new Map<FilterGroup, AdvancedFilterModel>();
      }
      return {
        ...state,
        pageData: state.pageData?.set(selectedTabId, {
          ...currState,
          appliedGraphFilters: currState?.appliedGraphFilters?.set(payload.group, payload.value),
        } as PageDataType),
      };
    }
    case REMOVE_FILTERS: {
      // return removeFilter(state, selectedTabId, "appliedFilters", payload);
      return removeFilterGroup(state, selectedTabId, "appliedFilters", payload);
    }
    case REMOVE_TREE_FILTERS: {
      return removeFilterGroup(state, selectedTabId, "appliedTreeFilters", payload);
    }
    case REMOVE_GRAPH_FILTERS: {
      return removeFilterGroup(state, selectedTabId, "appliedGraphFilters", payload);
    }
    default:
      return state;
  }
};

//  a generic method for remove filters

// This type returns all keys that have a value of type AdvancedFilterModel
// type AdvancedFilterModelKeyOf<T> = {
//   // for all keys in T
//   [K in keyof T]: // if the value of this key is a AdvancedFilterModel?, keep it. Else, discard it
//   T[K] extends AdvancedFilterModel | undefined  ? K : never; // TODO - becomes  GroupFilters | undefined

//   // Get the union type of the remaining values.
// }[keyof T];

// type K = AdvancedFilterModelKeyOf<PageDataType>;

// const removeFilter = (
//   state: StoreContextState,
//   selectedTabId: number,
//   propName: K,
//   payload: any // is actually {value?: TableEnum, group?: string}
// ) => {
//   if (!propName) return state;

//   // remove all if no datasource specififed or it is the only datasource
//   // N.B. first value in TableEnum is 0 so be careful with falsey logic
//   if (
//     payload === undefined ||
//     (payload?.value !== undefined &&
//       state.pageData
//         ?.get(selectedTabId)
//         ?.[propName]?.dataSources.every((x) => x.name === TableEnum[payload.value]))
//   ) {
//     return {
//       ...state,
//       pageData: state.pageData?.set(selectedTabId, {
//         ...state.pageData?.get(selectedTabId),
//         [propName]: undefined,
//       } as PageDataType),
//     };
//   } else {
//     // just remove the given datasource from the filters
//     const pageData = { ...state.pageData?.get(selectedTabId) } as PageDataType;

//     // deep copy at each level so don't effect the original advanced filter data
//     if (propName && pageData?.[propName]?.dataSources) {
//       pageData[propName] = { ...pageData[propName] } as AdvancedFilterModel;
//       const f = pageData[propName];
//       if (f) {
//         f.dataSources = [...f?.dataSources.filter((x) => x.name !== TableEnum[payload.value])];
//       }
//     }
//     return {
//       ...state,
//       pageData: state.pageData?.set(selectedTabId, pageData),
//     };
//   }
// };


// This type returns all keys that have a value of type AdvancedFilterModel
type AdvancedFilterModelMapKeyOf<T> = {
  // for all keys in T
  [K in keyof T]: // if the value of this key is a GroupFilters?, keep it. Else, discard it
  T[K] extends GroupFilters | undefined  ? K : never; 

  // Get the union type of the remaining values.
}[keyof T];

type KK = AdvancedFilterModelMapKeyOf<PageDataType>;

const removeFilterGroup = (
  state: StoreContextState,
  selectedTabId: number,
  propName: KK,
  payload: any // is actually {value?: TableEnum, group?: string}
) => {
  if (!propName) return state;

  // remove all if no datasource specified or it is the only datasource in the color group
  // N.B. first value in TableEnum is 0 so be careful with falsey logic
  if (
    payload === undefined ||  // TODO - is this ever possible??
    (payload?.value !== undefined &&
      state.pageData
        ?.get(selectedTabId)
        ?.[propName]
        ?.get(payload.group) 
        ?.dataSources.every((x) => x.name === TableEnum[payload.value]))
  ) {
    // delete the color group entry
    state.pageData?.get(selectedTabId)?.[propName]?.delete(payload.group);
    return {
      ...state,
    };
  } else {
    // just remove the given datasource from the filters

    // TODO - shouldnt need this if all calls to applyfilter deepclone the payload
    // deep copy at each level so don't effect the original advanced filter data
    const pageData = _.cloneDeep(state.pageData?.get(selectedTabId)) as PageDataType;

    if (propName && pageData?.[propName]?.get(payload.group)?.dataSources) {
      const filterModel = pageData[propName]?.get(payload.group);
      if (filterModel) {
        filterModel.dataSources = [...filterModel.dataSources.filter((x) => x.name !== TableEnum[payload.value])];
      }
    }
    return {
      ...state,
      pageData: state.pageData?.set(selectedTabId, pageData),
    };
  }
};

export default pageDataReducer;
