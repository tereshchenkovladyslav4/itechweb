import React, { createContext, useContext, useReducer } from "react";
import { useSelectors } from "./selectors/useSelectors";
import { StoreContextState } from "./types/StoreContextState";
import InitialState from "./types/initialState";
import PageDataReducer from "./reducers/PageDataReducer";
import MenuReducer from "./reducers/MenuReducer";
import UserReducer from "./reducers/UserReducer";
import HandleErrorReducer from "./reducers/HandleErrorReducer";
import TemplateReducer from "./reducers/TemplateReducer";
import hiddenReducer from "./reducers/HiddenReducer";
import CaseReducer from "./reducers/CaseReducer";
import DataSourceReducer from "./reducers/DataSourceReducer";

type ContextType = {
  state: StoreContextState;
  selectors: ReturnType<typeof useSelectors>;
  dispatch: React.Dispatch<any>;
};

export const StoreContext = createContext<ContextType>({
  state: InitialState,
  selectors: {
    getPageData: () => undefined,
    getSelectedGridRow: () => undefined,
    getSelectedVersion: () => undefined,
    getAppliedFilters: () => undefined,
    getAppliedTreeFilters: () => undefined,
    getAppliedGraphFilters: () => undefined,
    getAllFilters: () => [],
    getAllAppliedFiltersForDataSource: () => undefined,
    getAllFilterModelsForDataSource:() => undefined,
    getAllFiltersForDataSource: (src: string) => [],
    getShowError: () => false,
    getTemplates: () => [],
    getViews: () => [],
    getSelectedCaseId: () => undefined,
    getSelectedMenuAndTab: (): { menuId?: number; tabId?: number } => ({}),
    getShowHidden: () => false,
    getSelectedCase: () => undefined,
    getSelectedTabId: () => undefined,
    getSelectedTab: () => undefined,
    getMenus: () => [],
    getDataSources: () => [],
    getCaseClosed: () => undefined,
    getFolders: () => [],
  },
  dispatch: () => null,
});

const combineReducers =
  (...reducers: any) =>
  (state = InitialState, action = {}) => {
    for (let i = 0; i < reducers.length; i++) state = reducers[i](state, action);
    return state;
  };

export const StoreProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(
    combineReducers(
      PageDataReducer,
      MenuReducer,
      UserReducer,
      HandleErrorReducer,
      TemplateReducer,
      hiddenReducer,
      CaseReducer,
      DataSourceReducer
    ),
    InitialState
  );
  const selectors = useSelectors(state);

  return (
    <StoreContext.Provider value={{ state, selectors, dispatch }}>{children}</StoreContext.Provider>
  );
};

export const useStore = (): ContextType => useContext(StoreContext);
