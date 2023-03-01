import { Action } from "../actions/Action";
import { UPDATE_FOLDERS, UPDATE_MENUS } from "../constants/Constants";
import { StoreContextState } from "../types/StoreContextState";

const MenuReducer = (
  state: StoreContextState,
  action: Action
): StoreContextState => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_MENUS:
      return {
        ...state,
        menuList: payload,
      };
    case UPDATE_FOLDERS:
      return {
        ...state,
        folderList: payload,
      };
    // case UPDATED_SELECTED_MENU:
    //   {
    //   sessionStorage.setItem(
    //     "caseId",
    //     payload.selectedCaseId ? String(payload.selectedCaseId) : ""
    //   );
    //   // clears selectedCase if not same as selectedCaseId
    //   const newState = {
    //     ...state,
    //     selectedMenuItemId: payload.selectedMenuItemId,
    //     selectedTabId: payload.selectedTabId,
    //     selectedCaseId: payload.selectedCaseId,
    //     selectedCase: payload.selectedCaseId !== state.selectedCase?.rowId ? undefined : state.selectedCase
    //   };
    //   return newState; 
    // }
    default:
      return state;
  }
};

export default MenuReducer;
