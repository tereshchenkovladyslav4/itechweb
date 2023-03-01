import React, { ReactElement, useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { RouteProps, useHistory } from "react-router-dom";
import { tabService } from "../_services/tabService";
import { authenticationService } from "../_services/authenticationService";
import { componentService } from "../_services/componentService";
import { ITechDataWebMenuExtended } from "../Model/Extended/ITechDataWebMenuExtended";
import { ITechDataWebTabExtended } from "../Model/Extended/ITechDataWebTabExtended";
import { useStore } from "../_context/Store";
import { updateMenuListAction } from "../_context/actions/MenuActions";
import { StyleProps, useStyles } from "./Menu.styles";
import { GetMenuOrCreateTabForFilePath } from "./Menu.utilities";
import { handleFormFn } from "./MenuDisplay";
import { getCase } from "../_context/thunks/case";
import { caseService } from "../_services/caseService";
import SideMenuTreeTemplatesAndResults from "./SideMenuTreeTemplatesAndResults";
import MenuDrawer from "./MenuDrawer";
import IconManager from "../_components/IconManager";
import ResponsiveGrid from "../ResponsiveGrid/ResponsiveGrid";
import SlidePanel from "./SlidePanel";
import TabList from "./TabList";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
//
import Toolbar from "@mui/material/Toolbar";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import clsx from "clsx";
import Draggable, { ControlPosition, DraggableData, DraggableEventHandler } from "react-draggable";
import PrevNext from "../Actions/PrevNext/PrevNext";
// import TemplateList from "./Templates/TemplateList";
// import { iTechDataWebTemplateEnum } from "../Model/iTechRestApi/iTechDataWebTemplateEnum";
// import TemplateTreeList from "./Templates/TemplateTreeList";
//import SideMenuTree from "./SideMenuTree";

interface MenuProps {
  location: RouteProps["location"];
  setCurrentTab: (rowId: number) => void;
  handleFormOpen: handleFormFn;
  updateMenus: (menus: any, currentmenu?: ITechDataWebMenuExtended) => void;
}

const Menu: React.FC<MenuProps> = ({
  location,
  setCurrentTab,
  handleFormOpen,
  updateMenus,
}): ReactElement => {
  const { dispatch, selectors } = useStore();

  const currentUserId = authenticationService.currentUserId;
  const menuList = selectors.getMenus();
  const theme = useTheme();
  const history = useHistory();
  // const tabListRef = createRef();
  const [menuExpanded, setMenuExpanded] = useState(true);
  const [isFileRoute, setIsFileRoute] = useState(false);
  const dragRef = useRef<HTMLSpanElement>(null);
  const [styles, setStyles] = useState<StyleProps>({ width: 270 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const menuArea = "menuArea";
  const resizeDelay =
    Math.max(theme.transitions.duration.enteringScreen, theme.transitions.duration.leavingScreen) +
    800;

  const classes = useStyles(styles);

  const _setTabList = (tabs: ITechDataWebTabExtended[]) => {
    const newMenuList = [...menuList];
    const item = newMenuList.find((m) => m.selected === true);
    if (item) {
      item.iTechDataWebTabs = tabs;
      const tab = item.iTechDataWebTabs.find((t) => t.selected === true);
      if (tab) {
        history.push(tab.path);
        authenticationService.updateTab(tab.rowId);
      }
    }
    dispatch(updateMenuListAction(newMenuList));
  };

  const _onSetCurrentMenu = (menu?: ITechDataWebMenuExtended) => {
    const newMenuList = [...menuList];
    newMenuList.forEach((m) => (m.selected = menu?.rowId === m.rowId));
    if (menu) {
      authenticationService.updateMenu(menu.rowId);
      // menu.selected = true;
    }
    updateMenus(newMenuList, menu); // shortcircuit updatemenus getting selected from store as we have just dispatched
  };

  const _handleDrawerOpen = () => {
    setMenuExpanded(true);
    setStyles({ width: 270 });
  };

  const _handleDrawerClose = () => {
    setMenuExpanded(false);
    setStyles({ width: 50 });
  };

  const _getCurrentMenu = () => {
    if (menuList.length === 0) return null;

    return GetMenuOrCreateTabForFilePath(
      location,
      menuList,
      isFileRoute,
      setIsFileRoute,
      history,
      _onSetCurrentMenu
    );
  };

  const currentMenu = _getCurrentMenu();

  // useEffect(() => {
  //   const node: any = tabListRef.current;
  //   if (node) {
  //     setMenuHeight(node.clientHeight);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [tabListRef.current]);

  useEffect(() => {
    // we dont get the onAnimationEnd when opening the drawer... so hack to fire resize event here.
    if (menuExpanded) {
      setTimeout(() => window.dispatchEvent(new Event("resize")), resizeDelay);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuExpanded]);

  useEffect(() => {
    // Change in selected case - so load / clear if not a case
    getCase(selectors, caseService.get, dispatch);
  }, [selectors.getSelectedCaseId()]);

  const _resizeEvent = (data: DraggableData) => {
    setStyles((prev) => ({ ...prev, width: prev.width + data?.x }));
    const el = dragRef.current;
    if (el && (el as any).state) {
      el.style.removeProperty("transform");
      (el as any).state.x = 0;
    }
  };

  const _onDrag = () => {
    //if (dragRef.current) dragRef.current.style.transform = "inherit";
  };

  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        color="primary"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: menuExpanded,
          [classes.closed]: selectors.getCaseClosed(),
        })}
      >
        <Draggable
          axis="x"
          scale={1}
          position={{ x: 0, y: 0 } as unknown as ControlPosition}
          onStop={(_, data) => {
            setTimeout(() => {
              _resizeEvent(data);
            }, 200);
            return;
          }}
          onDrag={_onDrag}
        >
          <span className={classes.draggable} ref={dragRef}></span>
        </Draggable>
        <Toolbar className={classes.toolBar}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={_handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: menuExpanded,
            })}
            size="large"
          >
            <IconManager icon="Menu" />
          </IconButton>
          {currentMenu && (
            <TabList
              // ref={tabListmRef}
              location={location}
              tabList={currentMenu.iTechDataWebTabs}
              parentMenu={currentMenu}
              setTabList={_setTabList}
              setCurrentTab={setCurrentTab}
              handleFormOpen={handleFormOpen}
              tabService={tabService}
            />
          )}
          <SlidePanel icon={<ViewCarouselIcon />} anchor="right" area={menuArea}>
            <div className={classes.casesTree}>
              <SideMenuTreeTemplatesAndResults
                currentUserId={currentUserId}
                setTabList={_setTabList}
                setCurrentTab={setCurrentTab}
                tabList={currentMenu?.iTechDataWebTabs}
                parentMenu={currentMenu}
                onSetCurrentMenu={_onSetCurrentMenu}
              />

              {/* This one displayed cases / saved results / views */}
              {/* <SideMenuTree
                currentUser={currentUserId}
                setTabList={_setTabList}
                setCurrentTab={setCurrentTab}
                tabList={currentMenu?.iTechDataWebTabs}
                parentMenu={currentMenu}
                onSetCurrentMenu={_onSetCurrentMenu}
              /> */}

              {/* This one is just a list of templates */}
              {/* <TemplateTreeList
                loadingArea={menuArea}
                type={iTechDataWebTemplateEnum.template}
                setTabList={_setTabList}
                setCurrentTab={setCurrentTab}
                tabList={currentMenu?.iTechDataWebTabs}
                parentMenu={currentMenu}
              /> */}
            </div>
          </SlidePanel>
        </Toolbar>
      </AppBar>
      <MenuDrawer
        menuExpanded={menuExpanded}
        menuArea={menuArea}
        menuList={menuList}
        handleFormOpen={handleFormOpen}
        handleDrawerClose={_handleDrawerClose}
        onSetCurrentMenu={_onSetCurrentMenu}
        updateMenus={updateMenus}
        setTabList={_setTabList}
        setCurrentTab={setCurrentTab}
        styles={styles}
      />

      <main className={classes.content}>
        <div className={classes.menuTitle} />
        {currentMenu && (
          <ResponsiveGrid
            parent={currentMenu?.iTechDataWebTabs?.find((t) => !!t.selected)}
            service={componentService}
          />
        )}
      </main>
    </div>
  );
};

Menu.displayName = "Menu";

export default Menu;
