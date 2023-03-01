import React, { createRef, ReactElement, useRef } from "react";
import { menuService } from "../_services/menuService";
import { authenticationService } from "../_services/authenticationService";
import { ITechDataWebMenuExtended } from "../Model/Extended/ITechDataWebMenuExtended";
import { ITechDataWebTabExtended } from "../Model/Extended/ITechDataWebTabExtended";
import { arrayMove } from "../_helpers/utilities";
import { useStore } from "../_context/Store";
import { updateMenuListAction } from "../_context/actions/MenuActions";
import { logOutUserAction } from "../_context/actions/UserActions";
import { showErrorDialogAction } from "../_context/actions/HandleErrorActions";
import { StyleProps, useStyles } from "./Menu.styles";
// import { useTheme } from "@mui/material/styles";
import { useHistory } from "react-router-dom";
import { trackPromise } from "react-promise-tracker";
import { resultsService } from "../_services/resultsService";
import { templateService } from "../_services/templateService";
import { caseService } from "../_services/caseService";
import { handleFormFn } from "./MenuDisplay";
import _ from "lodash";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
//
import clsx from "clsx";
import MenuTree from "./MenuTree";
import MenuItem from "./MenuItem";
import MenuTitle from "./MenuTitle";
import ProfileListItem from "./ProfileListItem";

interface MenuDrawerProps {
  menuExpanded: boolean;
  menuArea: string;
  menuList: ITechDataWebMenuExtended[];
  handleFormOpen: handleFormFn;
  handleDrawerClose: () => void;
  onSetCurrentMenu: (menu?: ITechDataWebMenuExtended | undefined) => void;
  updateMenus: (menus: any, currentmenu?: ITechDataWebMenuExtended) => void;
  setTabList: (tabs: ITechDataWebTabExtended[]) => void;
  setCurrentTab: (rowId: number) => void;
  styles: StyleProps;
}

const MenuDrawer: React.FC<MenuDrawerProps> = ({
  menuExpanded,
  menuArea,
  menuList,
  handleFormOpen,
  handleDrawerClose,
  onSetCurrentMenu,
  updateMenus,
  setTabList,
  setCurrentTab,
  styles,
}): ReactElement => {
  // const theme = useTheme();
  const { dispatch } = useStore();
  const history = useHistory();
  const menuRef = createRef();
  const elRefs = useRef<(any | null)[]>([]);
  const currentUser = authenticationService.currentUserValue;
  const profileName = `${currentUser?.forename} ${currentUser?.surname}`;
  const classes = useStyles(styles);

  const _logout = () => {
    authenticationService.logout();
    dispatch(logOutUserAction());
    history.push("/login");
  };

  const _addTabToCurrent = (tab: ITechDataWebTabExtended) => {
    const newMenuList = [...menuList];
    const item = newMenuList.find((m) => !!m.selected);
    if (item) {
      const newTab = { ...tab };
      newTab.isHightlighted = true;
      newTab.selected = true;
      newTab.path = `${item.path}/${tab.name}`;
      item.iTechDataWebTabs.forEach((x) => ((x.isHightlighted = false), (x.selected = false)));
      newTab.position = item.iTechDataWebTabs.length;
      item.iTechDataWebTabs.push(newTab);
      updateMenus(newMenuList, item);
    }
  };

  interface MenuIndexProps {
    menu: any;
    index: number;
  }

  const _setMenuIndex = ({ menu, index }: MenuIndexProps) => {
    if (menuList.length === 0) {
      return;
    }

    const newMenus = [...menuList];
    if (index >= newMenus.length) {
      index = newMenus.length - 1;
    }
    if (index < 0) {
      index = 0;
    }

    arrayMove(newMenus, menu.position, index);
    newMenus.forEach((menu, i) => (menu.position = i));
    dispatch(updateMenuListAction(_.sortBy(newMenus, (obj) => obj.position)));
    trackPromise(menuService.update(newMenus), menuArea).catch((error) => {
      dispatch(showErrorDialogAction(MenuDrawer.displayName, error?.message));
    });
  };

  return (
    <Drawer
      onAnimationEnd={() => {
        window.dispatchEvent(new Event("resize"));
      }}
      variant="permanent"
      color="secondary"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: menuExpanded,
        [classes.drawerClose]: !menuExpanded,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: menuExpanded,
          [classes.drawerClose]: !menuExpanded,
        }),
      }}
    >
      <MenuTitle drawerCloseHandler={handleDrawerClose} />
      {/* <Divider />
      <StaticMenuList
        addPageHandler={() => handleFormOpen("editmenu", undefined)}
        menuExpanded={menuExpanded}
      /> */}

      {/* < rootRef={menuRef}> */}
      <>
        {menuExpanded && (
          <div className={classes.menuTree}>
            <MenuTree
              menuList={menuList}
              onSetCurrentMenu={onSetCurrentMenu}
              onAddTab={_addTabToCurrent}
              onAction={handleFormOpen}
              setTabList={setTabList}
              setCurrentTab={setCurrentTab}
              resultsService={resultsService}
              templateService={templateService}
              caseService={caseService}
            />
          </div>
        )}

        {!menuExpanded && (
          <List color="secondary" className={classes.menuList}>
            {menuList
              .filter((m) => m.iTechDataSecurityObjectRowId !== null)
              .map((item, i) => (
                <MenuItem
                  item={item}
                  disable={!menuExpanded}
                  menuRef={menuRef}
                  elRefs={elRefs}
                  i={i}
                  key={item.position}
                  location={location}
                  onEdit={() => handleFormOpen("editmenu", item)}
                  onDelete={() => handleFormOpen("delete", item)}
                  onSetCurrentMenu={onSetCurrentMenu}
                  onSetMenuIndex={_setMenuIndex}
                />
              ))}
          </List>
        )}

        {/* {menuExpanded && (
            <>
              <Divider />
              <TemplateList
                loadingArea={menuArea}
                type={iTechDataWebTemplateEnum.template}
                setTabList={setTabList}
                setCurrentTab={setCurrentTab}
                tabList={currentMenu?.iTechDataWebTabs}
                parentMenu={currentMenu}
              />
            </>
          )} */}
        <ProfileListItem
          profileName={profileName}
          menuExpanded={menuExpanded}
          logoutHandler={_logout}
          area={menuArea}
        />
      </>
      {/* </> */}
    </Drawer>
  );
};

MenuDrawer.displayName = "MenuDrawer";

export default MenuDrawer;
