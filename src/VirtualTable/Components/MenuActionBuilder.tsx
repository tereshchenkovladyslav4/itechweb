import React from "react";
import { History } from "history";
import { MenuAction } from "../../Menu/MenuFunction";
import IconManager from "../../_components/IconManager";
import { showHiddenAction } from "../../_context/actions/HiddenActions";
import { onOpen, onOpenFullscreen, onOpenNewTab } from "../../_helpers/fileActions";

export { menuActionBuilder, menuAction, openItem, fullScreen, newTab, defaultMenu };

function openItem(
  selectedItem: string,
  selectOnClick: (gid: any, rowData?: any) => Promise<void>,
  rowData: any
): MenuAction {
  return menuAction(() => onOpen(selectedItem, selectOnClick, rowData), "Input", "Open");
}

function fullScreen(
  selectedItem: string,
  selectOnClick: (gid: any, rowData?: any) => Promise<void>,
  rowData: any,
  dispatch: (value: any) => void
): MenuAction {
  return menuAction(
    () =>
      onOpenFullscreen(
        selectedItem,
        () => dispatch(showHiddenAction(true)),
        selectOnClick,
        rowData
      ),
    "Fullscreen",
    "Open Full Screen"
  );
}

function newTab(
  history: History,
  selectedItem: string,
  dataSource: string | undefined
): MenuAction {
  return menuAction(
    () => onOpenNewTab(history, selectedItem, dataSource),
    "Tab",
    "Open in New Tab"
  );
}

/**
 * Build menu action
 */
function menuAction(onClick: () => void, icon: string, name: string): MenuAction {
  return {
    icon: <IconManager fontSize="small" icon={icon} onClick={onClick} />,
    name: name,
    toolTipPlacement: "left-end",
  } as MenuAction;
}

/**
 * Add IDs to array of actions
 */
function menuActionBuilder(actions: MenuAction[]): MenuAction[] {
  actions = actions.map((x, i) => ({ ...x, id: i }));
  return actions;
}

/**
 * Build default row actions - open/full screen/new tab
 */
function defaultMenu(
  selectedItem: string,
  selectOnClick: (gid: any, rowData?: any) => Promise<void>,
  rowData: any,
  dispatch: (value: any) => void,
  history: History,
  dataSource: string | undefined
): MenuAction[] {
  return menuActionBuilder([
    openItem(selectedItem, selectOnClick, rowData),
    fullScreen(selectedItem, selectOnClick, rowData, dispatch),
    newTab(history, selectedItem, dataSource),
  ]);
}
