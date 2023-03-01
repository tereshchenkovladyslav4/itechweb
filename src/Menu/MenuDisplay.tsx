import React, { useEffect, useRef, useState } from "react";
import { ITechDataWebMenuExtended } from "../Model/Extended/ITechDataWebMenuExtended";
import { authenticationService } from "../_services/authenticationService";
import { menuService } from "../_services/menuService";
import { useStore } from "../_context/Store";
import { trackPromise } from "react-promise-tracker";
import { ITechDataWebTabExtended } from "../Model/Extended/ITechDataWebTabExtended";
import { showErrorDialogAction } from "../_context/actions/HandleErrorActions";
import { updateFolderListAction, updateMenuListAction } from "../_context/actions/MenuActions";
import { RouteProps } from "react-router";
import { useHistory } from "react-router-dom";
import { tabService } from "../_services/tabService";
import { ITechDataWebMenu } from "../Model/iTechRestApi/ITechDataWebMenu";
import { caseService } from "../_services/caseService";
import { off, on, UpdateMenusEvent } from "../_helpers/events";
import { ITechDataWebFolderExtended } from "../Model/Extended/ITechDataWebFolderExtended";
import { NodeType, TreeNode } from "./TreeNode";
import { ITechDataWebFolder } from "../Model/iTechRestApi/ITechDataWebFolder";
import { iTechDataWebFolderEnum } from "../Model/iTechRestApi/iTechDataWebFolderEnum";
import { removeTabFiltersAction } from "../_context/actions/PageDataActions";
import _ from "lodash";
import useAsyncError from "../_helpers/hooks/useAsyncError";
import Menu from "./Menu";
import FormBuilder from "../Form/FormBuilder";
import PageMenu from "../Form/PageMenu";
import EditTab from "../Form/EditTab";
import AreYouSure from "../Form/AreYouSure";
import EditFolder from "../Form/EditFolder";

interface MenuDisplayProps {
  location: RouteProps["location"];
}

export type handleFormFn = (
  currentForm: "editmenu" | "delete" | "edittab" | "deleteCase" | "addfolder" | "folderproperties",
  item: ITechDataWebMenuExtended | TreeNode | ITechDataWebTabExtended | undefined
) => void;

/*
CURRENT MENU SELECTION SOURCES - priority
1) URL Path (on load)
2) Auth user selected menu (user selection while in page)
3) Tab selected property (while in page go to previously selected tab)
4) First Tab (if no selected tabs go to first one in parent menu)
*/
const MenuDisplay: React.FC<MenuDisplayProps> = ({ location }) => {
  const { dispatch, selectors } = useStore();
  const history = useHistory();
  const [currentUser, setCurrentUser] = useState(authenticationService.currentUserValue);
  const [loadForm, setLoadForm] = useState(false);
  const [currentFormObject, setCurrentFormMenu] = useState<any>();
  const [currentForm, setCurrentForm] = useState("");
  const lastMenu = useRef(0);
  const [menuArea] = useState("menuArea");
  const throwError = useAsyncError();
  // for use in _menuSetter as can be called via eventhandler which would then have initial value for location
  const locationRef = useRef(location);
  locationRef.current = location;

  // flatten folder hierarchy into an array of menus
  const getAllMenus = (folders: ITechDataWebFolderExtended[]) => {
    let menus: ITechDataWebMenuExtended[] = [];

    folders.forEach((folder) => {
      menus = [...menus, ...folder.iTechDataWebMenus];
      if (folder.iTechDataWebFolders) {
        menus = [...menus, ...getAllMenus(folder.iTechDataWebFolders)];
      }
    });
    return menus;
  };

  const menuSelectionSetterFromFolders = (folders: ITechDataWebFolderExtended[]) => {
    const menus = getAllMenus(folders);
    _menuSelectionSetter(menus);
    dispatch(updateFolderListAction(folders));
  };
  // used by AddToCaseDlg
  useEffect(() => {
    on(UpdateMenusEvent, _updateAllMenus);

    return () => {
      off(UpdateMenusEvent, _updateAllMenus);
    };
  }, []);

  useEffect(() => {
    const menuList = selectors.getMenus();
    if (menuList.length > 0) {
      _menuSelectionSetter(menuList);
      return;
    }

    let isMounted = true;
    const subscription = authenticationService.currentUser.subscribe(
      (x) => isMounted && setCurrentUser(x)
    );
    trackPromise(menuService.getAll(), MenuDisplay.displayName).then(
      (folders) => {
        if (isMounted) {
          menuSelectionSetterFromFolders(folders);
        }
      },
      (error) => {
        // where the error is from an async action - we can't just dispatch to trigger the error boundary, need to rethrow
        // dispatch(showErrorDialogAction(MenuDisplay.displayName, error?.message));
        throwError(new Error(error?.message || error));
      }
    );
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [menuService, authenticationService, location?.pathname]);

  // High level action that will remove any filters present in the context on the next render cycle
  // i.e. listeners to the selectors that return tab filters - will get the filters once then they will be blank
  useEffect(() => {
    const page = selectors.getPageData();
    if (page && (page.appliedFilters || page.appliedGraphFilters || page.appliedTreeFilters)) {
      dispatch(removeTabFiltersAction()); // remove filters from current tab
    }
  }, [JSON.stringify(selectors.getPageData())]);

  const _menuSelectionSetter = (menus: ITechDataWebMenuExtended[]) => {
    let currentMenu: ITechDataWebMenuExtended | undefined = undefined;
    const path = locationRef.current?.pathname?.toLowerCase();
    const pathNoTab = path?.substring(0, path?.lastIndexOf("/")); // drop the tab part of the path

    menus.forEach((menu: ITechDataWebMenuExtended) => {
      menu.selected = pathNoTab
        ? menu.path === pathNoTab
        : currentUser?.authenticatedUser.iTechDataWebMenuRowId === menu.rowId;

      menu.iTechDataWebTabs?.sort((a, b) => (a?.position || 0) - (b?.position || 0));
      if (menu.selected === true) {
        currentMenu = menu;
        menu.iTechDataWebTabs?.map((t: ITechDataWebTabExtended) => {
          const selected = path
            ? t.path.toLowerCase() === locationRef.current?.pathname.toLowerCase()
            : currentUser?.authenticatedUser.iTechDataWebTabRowId === t.rowId;
          return (t.isHightlighted = selected), (t.selected = selected);
        });
      }
      if (
        menu.selected === true &&
        menu.iTechDataWebTabs.length > 0 &&
        menu.iTechDataWebTabs.find((t) => t.selected === true) === undefined
      ) {
        menu.iTechDataWebTabs[0].selected = true;
        menu.iTechDataWebTabs[0].isHightlighted = true;
      }
    });

    const selectedMenu = menus.find((m) => m.selected === true);

    if (menus.length > 0 && selectedMenu === undefined) {
      // filter out the cases and sort by name
      const pageMenus = menus
        .filter((x) => x.iTechDataSecurityObjectRowId !== null)
        .sort((a, b) => (a.name > b.name ? 1 : -1));
      if (pageMenus.length) {
        pageMenus[0].selected = true;
        currentMenu = pageMenus[0];
        if (pageMenus[0].iTechDataWebTabs.length > 0) {
          pageMenus[0].iTechDataWebTabs[0].selected = true;
          pageMenus[0].iTechDataWebTabs[0].isHightlighted = true;
          history.push(pageMenus[0].iTechDataWebTabs[0].path);
        }
      }
    }
    // set the browser tab title to that of selected page / case
    if (currentMenu?.name) {
      document.title = currentMenu.name;
    }

    dispatch(updateMenuListAction(menus));
  };

  const _selectedMenu = () => {
    if (!currentUser) return null;
    // TODO - authenticatedUser.iTechDataWebMenuRowId doesnt seem correct on first load?

    const menus = selectors.getMenus();
    let menu = menus.find((m) => m.selected);

    if (!menu) {
      menu = menus.find((m) => m.rowId === currentUser.authenticatedUser.iTechDataWebMenuRowId);
    }

    return menu;
  };

  const _setCurrentTab = (rowId: number) => {
    const newMenuList = [...selectors.getMenus()];
    const item = _selectedMenu();
    if (item && item.iTechDataWebTabs) {
      const prevTab = item.iTechDataWebTabs.find((x) => x.selected);
      if (prevTab) {
        // clear the tab filters state
        dispatch(removeTabFiltersAction(prevTab.rowId));
      }
      item.iTechDataWebTabs.forEach((t: ITechDataWebTabExtended) => {
        t.isHightlighted = t.rowId === rowId;
        t.selected = t.rowId === rowId;
      });
      _isHighlighted(rowId);
    }
    authenticationService.updateTab(rowId);
    _updateMenus(newMenuList, item || undefined); // TODO - test... wasnt passing selected item
  };

  const _updateMenus = (
    menus: ITechDataWebMenuExtended[],
    currentmenu?: ITechDataWebMenuExtended
  ) => {
    const menu = currentmenu || _selectedMenu();

    let path = undefined;
    if (menu?.iTechDataWebTabs && menu?.iTechDataWebTabs.length > 0) {
      let selectedTab = menu.iTechDataWebTabs.find((t) => !!t.selected);

      if (!selectedTab) {
        menu.iTechDataWebTabs.map((t) => ((t.isHightlighted = false), (t.selected = false)));
        const tab = menu.iTechDataWebTabs[0];
        tab.selected = true;
        tab.isHightlighted = true;
        selectedTab = tab;
      }
      if (history.action !== "PUSH" || selectedTab.rowId !== lastMenu.current) {
        lastMenu.current = selectedTab.rowId;
        path = selectedTab.path;
      }
    }
    // set the browser tab title to that of selected page / case ( captures path for new page added)
    if (menu?.name) {
      document.title = menu.name;
    }
    dispatch(updateMenuListAction(_.sortBy(menus, (obj) => obj.position)));

    // push history after we've dispatched the menus - otherwise the useffect on location?.path triggers before the store menus are updated
    // resulting in missing page entry in menulist if just added one
    if (path) {
      history.push(path);
    }
  };

  const _isHighlighted = (highlightedRowId: number) => {
    const newMenuList = [...selectors.getMenus()];
    const item = newMenuList.find((m) => !!m.selected);
    if (item && item.iTechDataWebTabs) {
      const tab = item.iTechDataWebTabs.find(
        (t: ITechDataWebTabExtended) => t.rowId === highlightedRowId
      );
      if (tab) {
        tab.isHightlighted = true;
        if (tab.iTechDataWebTabParentRowId != null) {
          _isHighlighted(tab.iTechDataWebTabParentRowId);
        }
      }
    }
  };

  const _onFormChange = (display: boolean, currentForm = "", item = null) => {
    setLoadForm(display);
    if (!display) {
      setCurrentFormMenu(item);
      setCurrentForm(currentForm);
    }
  };

  const _onFormClose = () => {
    setLoadForm(false);
  };

  const _removeObject = () => {
    // currentFormObject can be a MenuTreeNode or ITechDataWebTab
    // if (currentFormObject.iTechDataWebMenuRowId || currentFormObject.icon === "tab") {
    if (currentFormObject.iTechDataWebMenuRowId || currentFormObject.nodeType === NodeType.tab) {
      return trackPromise(tabService.remove(currentFormObject.rowId), menuArea).then(
        _updateAllMenus
      );
    } else {
      return trackPromise(menuService.remove(currentFormObject.rowId), menuArea).then(
        _updateAllMenus
      );
    }
  };

  const _removeCase = () => {
    // currentFormObject can be a MenuTreeNode or ITechDataWebTab
    return trackPromise(caseService.remove(currentFormObject.rowId), menuArea).then(
      _updateAllMenus
    );
  };

  const _updateAllMenus = () => {
    trackPromise(menuService.getAll(), menuArea).then(menuSelectionSetterFromFolders, (error) => {
      dispatch(showErrorDialogAction(Menu.displayName, error?.message));
    });
  };

  const _editTab = (name: string) => {
    return trackPromise(tabService.name(currentFormObject.rowId, name), menuArea).then(
      _updateAllMenus
    );
  };

  const _addFolder = (name: string) => {
    const folder: ITechDataWebFolderExtended =
      new ITechDataWebFolder() as ITechDataWebFolderExtended;
    folder.name = name;
    folder.icon = "FolderOpen";
    folder.path = "";
    folder.iTechDataWebFolderParentRowId = currentFormObject.rowId;
    return trackPromise(menuService.addFolder(folder), menuArea).then(_updateAllMenus);
  };

  const _editMenu = (name: string, icon: string, folderId?: number) => {
    let updateService;
    const menu: ITechDataWebMenuExtended = new ITechDataWebMenu() as ITechDataWebMenuExtended;
    menu.name = name;
    menu.icon = icon;
    menu.path = "";
    if (folderId) menu.iTechDataWebFolderRowId = folderId;

    if (currentFormObject?.name) {
      updateService = trackPromise(
        menuService.edit(currentFormObject.rowId, name, icon, folderId),
        menuArea
      );
    } else {
      updateService = trackPromise(menuService.add(menu), menuArea);
    }

    return updateService.then(() =>
      trackPromise(menuService.getAll(), menuArea).then((folders) => {
        const menus = getAllMenus(folders);
        dispatch(updateFolderListAction(folders));

        const newMenu = menus.find((m) => m.name === name);
        if (!newMenu) return;
        if (!currentFormObject?.name) {
          authenticationService.updateMenu(newMenu.rowId);
          newMenu.selected = true;
          _updateMenus(menus, newMenu);
        } else {
          // just an edit so dont select it, but mark the already selected page / tab as selected in new returned menu list
          const currentMenus = selectors.getMenus();
          const currentselectedMenu = currentMenus.find((x) => x.selected === true);
          const currentSelectedTab = currentselectedMenu?.iTechDataWebTabs?.find(
            (x) => x.selected === true
          );
          const newMenu = menus.find((m) => m.rowId === currentselectedMenu?.rowId); // dont match on name as could have just been edited
          const newTab = newMenu?.iTechDataWebTabs?.find(
            (x) => x.name === currentSelectedTab?.name
          );
          if (newMenu) newMenu.selected = true; // reset this as not returned in server.
          if (newTab) newTab.selected = true;

          _updateMenus(menus, newMenu);

          // name edit or folder change - so update path - N.B. must include tab in path
          if (
            newMenu &&
            (currentselectedMenu?.name != newMenu.name ||
              currentselectedMenu.iTechDataWebFolderRowId != newMenu.iTechDataWebFolderRowId)
          ) {
            if (newTab) history.push(newTab.path);
            else history.push(newMenu.iTechDataWebTabs[0]?.path);
          }
        }
      })
    );
  };

  const _editFolder = (folderId: number) => {
    return trackPromise(menuService.updateFolder(currentFormObject.rowId, folderId), menuArea).then(
      () =>
        trackPromise(menuService.getAll(), menuArea).then((folders) => {
          const currentMenus = selectors.getMenus();
          dispatch(updateFolderListAction(folders));

          const currentselectedMenu = currentMenus.find((x) => x.selected === true);
          const currentSelectedTab = currentselectedMenu?.iTechDataWebTabs?.find(
            (x) => x.selected === true
          );

          const menus = getAllMenus(folders);
          if (currentselectedMenu) {
            const newMenu = menus.find((m) => m.rowId === currentselectedMenu.rowId); // dont match on name as could have just been edited
            const newTab =
              newMenu?.iTechDataWebTabs?.find((x) => x.name === currentSelectedTab?.name) ||
              newMenu?.iTechDataWebTabs[0];

            if (newMenu) newMenu.selected = true; // reset this as not returned in server.
            if (newTab) newTab.selected = true;

            _updateMenus(menus, newMenu);

            // N.B. must include tab in path
            if (newMenu && newTab && newTab.path !== currentSelectedTab?.path) {
              if (newTab) history.push(newTab.path);
              else history.push(newMenu.iTechDataWebTabs[0]?.path);
            }
          }
        })
    );
  };

  const _handleFormOpen: handleFormFn = (currentForm, item) => {
    setLoadForm(true);
    setCurrentFormMenu(item);
    setCurrentForm(currentForm);
  };

  return (
    <>
      <FormBuilder propDisplay={loadForm} onChange={_onFormChange}>
        {currentForm === "editmenu" ? (
          <PageMenu
            currentPage={currentFormObject}
            onClose={_onFormClose}
            onConfirm={_editMenu}
            area={menuArea}
            rootFolderTypes={[iTechDataWebFolderEnum.user, iTechDataWebFolderEnum.standard]}
            service={menuService}
          />
        ) : currentForm === "edittab" ? (
          <EditTab
            currentPage={currentFormObject}
            onClose={_onFormClose}
            onConfirm={_editTab}
            title="Edit Tab"
            area={menuArea}
          />
        ) : currentForm === "delete" ? (
          <AreYouSure onClose={_onFormClose} onConfirm={_removeObject} area={menuArea} />
        ) : currentForm === "deleteCase" ? (
          <AreYouSure onClose={_onFormClose} onConfirm={_removeCase} area={menuArea} />
        ) : currentForm === "addfolder" ? (
          <EditTab
            currentPage={undefined}
            onClose={_onFormClose}
            onConfirm={_addFolder}
            title="Add Folder"
            area={menuArea}
          />
        ) : currentForm === "folderproperties" ? (
          <EditFolder
            currentPage={currentFormObject}
            onClose={_onFormClose}
            onConfirm={_editFolder}
            title="Assign to Folder"
            area={menuArea}
          />
        ) : undefined}
      </FormBuilder>
      <Menu
        location={location}
        setCurrentTab={_setCurrentTab}
        handleFormOpen={_handleFormOpen}
        updateMenus={_updateMenus}
      />
    </>
  );
};
MenuDisplay.displayName = "MenuDisplay";
export default MenuDisplay;
