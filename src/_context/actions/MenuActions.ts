import { ITechDataWebFolderExtended } from "../../Model/Extended/ITechDataWebFolderExtended";
import { ITechDataWebMenuExtended } from "../../Model/Extended/ITechDataWebMenuExtended";
import { UPDATE_FOLDERS, UPDATE_MENUS } from "../constants/Constants";
import { Action } from "./Action";

// export const updateSelectedMenuAction = (
//   selectedMenuItemId: number,
//   selectedTabId: number,
//   selectedCaseId?: number | null
// ): Action => {
//   const payload = {
//     selectedMenuItemId: selectedMenuItemId,
//     selectedTabId: selectedTabId,
//     selectedCaseId: selectedCaseId,
//   };
//   return {
//     type: UPDATED_SELECTED_MENU,
//     payload: payload,
//   };
// };

export const updateMenuListAction = (
  menuList: Array<ITechDataWebMenuExtended>
): Action => {
  return {
    type: UPDATE_MENUS,
    payload: menuList,
  };
};

export const updateFolderListAction = (
  folderList: Array<ITechDataWebFolderExtended>
): Action => {
  return {
    type: UPDATE_FOLDERS,
    payload: folderList,
  };
};
