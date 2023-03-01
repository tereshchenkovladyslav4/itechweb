import React, { createRef, ReactElement, useEffect, useRef, useState } from "react";
import { RouteProps } from "react-router";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { tabService } from "../_services/tabService";
import { ITechDataWebTab } from "../Model/iTechRestApi/ITechDataWebTab";
import { ITechDataWebMenuExtended } from "../Model/Extended/ITechDataWebMenuExtended";
import { pathBuilder } from "../_helpers/pathBuilder";
import { ITechDataWebTabExtended } from "../Model/Extended/ITechDataWebTabExtended";
import { arrayMove } from "../_helpers/utilities";
import { AddTabWithGridEvent, off, on } from "../_helpers/events";
import { componentService } from "../_services/componentService";
import { ITechDataWebComponentExtended } from "../Model/Extended/ITechDataWebComponentExtended";
import { ITechDataWebComponent } from "../Model/iTechRestApi/ITechDataWebComponent";
import { useStore } from "../_context/Store";
import { applyGraphFiltersAction } from "../_context/actions/PageDataActions";
import { fullWidth, getFullHeight, getNextTabName } from "../_helpers/tabName";
import { handleFormFn } from "./MenuDisplay";
import { trackPromise } from "react-promise-tracker";
import { AddCircleOutline } from "@mui/icons-material";
import _ from "lodash";
import IconManager from "../_components/IconManager";
import TabItem from "./TabItem";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import BusyIconButton from "../_components/BusyIconButton";
import BusyButton from "../_components/BusyButton";
import { useStyles, errorStyles } from "./TabList.styles";
import clsx from "clsx";
// import { updateSelectedMenuAction } from "../_context/actions/MenuActions";

type TabListProps = {
  tabList: ITechDataWebTabExtended[];
  setTabList: (list: ITechDataWebTabExtended[]) => void;
  setCurrentTab: (rowId: number) => void;
  handleFormOpen: handleFormFn;
  location: RouteProps["location"];
  parentMenu?: ITechDataWebMenuExtended;
  tabService: typeof tabService;
};

const TabList: React.FC<TabListProps> = ({
  tabList,
  setTabList,
  setCurrentTab,
  handleFormOpen,
  location,
  parentMenu,
  tabService,
}): ReactElement => {
  const classes = useStyles();
  const theme = useTheme();
  const errors = errorStyles();
  const [addTabName, setAddTabName] = useState("");
  const [error, setError] = useState("");
  const tabButtonRef = useRef<any>();
  const tabFormRef = useRef<any>();
  const menuRef = createRef<any>();
  const elRefs = useRef<(any | null)[]>([]);
  const { dispatch, selectors } = useStore();
  const area = "AddTabBtn";

  // const highlightedrowid: number | undefined = tabList.find(
  //   (tab) =>
  //     tab.iTechDataWebTabParentRowId == null && tab.isHightlighted == true
  // )?.rowId;

  const _setTabIndex = (tab: any, index: any) => {
    if (tab.position === index || tabList.length === 0) {
      return;
    }
    if (index < 0) {
      index = 0;
    }
    const newTabs = tabList.filter((tab) => tab.depth == tab.depth);
    arrayMove(newTabs, tab?.position || 0, index);

    newTabs.forEach((menu, i) => (menu.position = i));
    const fullList = newTabs.concat(tabList.filter((tab) => tab.depth !== tab.depth));
    setTabList(_.sortBy(fullList, (obj) => obj.position));
    const item = tabList.find((item) => !!item.isHightlighted);
    if (item) {
      setCurrentTab(item.rowId);
    }
    tabService.update(fullList);
  };

  function _handleTabChange(e: any) {
    setAddTabName(e.target.value);
    setError("");
  }

  function _handleTabClear() {
    setAddTabName("");
    setError("");
  }

  const setupNewTab = (
    tabs: ITechDataWebTabExtended[],
    parentRowId: number | null
  ): ITechDataWebTabExtended => {
    if (!parentMenu) throw new Error("parent menu not set");

    const name = addTabName === "" ? getNextTabName(tabs, "Item ") : addTabName;
    const newTab = new ITechDataWebTab() as ITechDataWebTabExtended;
    newTab.position = tabList.length;
    newTab.name = name;
    newTab.depth = 0;
    newTab.iTechDataWebMenuRowId = parentMenu.rowId;
    newTab.iTechDataWebTabParentRowId = parentRowId;

    if (tabs.length) {
      newTab.iTechDataCaseRowId = tabs[0].iTechDataCaseRowId;
    }

    return newTab;
  };

  const _handleAddTab = (parentRowId: number | null) => (e: any) => {
    if (!parentMenu) throw new Error("parent menu not set");
    e.preventDefault();
    const tabs = [...tabList];
    const newTab = setupNewTab(tabs, parentRowId);
    trackPromise(tabService.add(newTab), area)
      .then((resultTab) => {
        tabs.map((t) => ((t.isHightlighted = false), (t.selected = false)));
        const tab = resultTab as ITechDataWebTabExtended;
        tab.path = `${parentMenu.path}${pathBuilder([tab.name])}`;
        tab.selected = true;
        tab.isHightlighted = true;
        tabs.push(tab);
        setTabList(tabs);
        setAddTabName("");
      })
      .catch((err) => {
        const errorMessage = err["Name"] || err;
        setError(errorMessage);
      });
  };

  function _getCurrentTab() {
    if (tabList.length === 0) return null;

    let defaultTab = tabList.find((t) => t.selected === true);

    if (!defaultTab) defaultTab = tabList[0];

    if (location?.pathname === "/") return defaultTab;

    const currentTab = tabList.find((t) => t.path === location?.pathname);

    return currentTab ? currentTab : defaultTab;
  }

  const currentTab = _getCurrentTab();

  const addGrid = async (tabId: number, data: any) => {
    const comp = new ITechDataWebComponent() as ITechDataWebComponentExtended;
    comp.x = 0;
    comp.y = 0;
    comp.w = fullWidth;
    comp.h = getFullHeight();
    comp.iTechDataWebTabRowId = tabId;
    comp.json = JSON.stringify(data);

    // save component in new tab
    return componentService.add(comp);
  };

  const _handleAddTabWithGrid = async (e: any) => {
    if (!parentMenu) throw new Error("parent menu not set");

    // create tab + new virtual table from e.detail

    const tabs = [...tabList];
    const newTab = setupNewTab(tabs, null);

    const tab = await tabService.add(newTab);

    // add the virtual table
    await addGrid(tab.rowId, e.detail.grid);
    const tab2 = tab as ITechDataWebTabExtended;
    tab2.path = `${parentMenu.path}${pathBuilder([tab.name])}`;
    tabs.push(tab2);
    setTabList(tabs);
    setCurrentTab(tab2.rowId);
    if (e.detail.graphFilters) {
      dispatch(applyGraphFiltersAction(e.detail.graphFilters));
    }
  };

  useEffect(() => {
    on(AddTabWithGridEvent, _handleAddTabWithGrid);

    return () => {
      off(AddTabWithGridEvent, _handleAddTabWithGrid);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabList]);

  useEffect(() => {
    if (currentTab) {
      tabService.selected(currentTab.rowId);

      sessionStorage.setItem(
        "caseId",
        currentTab.iTechDataCaseRowId ? String(currentTab.iTechDataCaseRowId) : ""
      );
      // dispatch(
      //   updateSelectedMenuAction(
      //     parentMenu.rowId,
      //     currentTab.rowId,
      //     currentTab.iTechDataCaseRowId
      //   )
      // );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab, tabService]);

  interface ButtonInTabsProps {
    children: any;
    parentRowID: number | null;
  }

  const ButtonInTabs = ({ children, parentRowID }: ButtonInTabsProps) => {
    const style: any = addTabName !== "" ? { opacity: 1, marginTop: -7 } : {};

    const _formMouseOver = () => {
      if (tabButtonRef.current && tabFormRef.current) {
        const buttonRect = tabButtonRef.current.getBoundingClientRect();
        if (buttonRect) {
          tabFormRef.current.style.left = `${buttonRect.left + window.scrollX}px`;
        }
      }
    };

    return (
      <form
        className={classes.buttonContainer}
        onSubmit={_handleAddTab(parentRowID)}
        ref={tabButtonRef}
        onMouseOver={() => _formMouseOver()}
      >
        <BusyButton
          className={classes.buttonStyle}
          onClick={_handleAddTab(parentRowID)}
          area={area}
          startIcon={<AddCircleOutline />}
        >
          {children}
        </BusyButton>
        <div className={classes.miniForm} style={style} ref={tabFormRef}>
          <TextField
            id="standard-basic"
            label="Tab name"
            autoFocus
            value={addTabName}
            onChange={_handleTabChange}
            error={!!error}
            helperText={error}
            FormHelperTextProps={{ classes: errors }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={_handleTabClear} size="small">
                    <IconManager icon="Clear" />
                  </IconButton>
                  <BusyIconButton onClick={_handleAddTab(parentRowID)} area={area} size="small">
                    <IconManager icon="Save" />
                  </BusyIconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
      </form>
    );
  };

  interface ChildTabsProps {
    childhighlightedrowid: number;
  }

  const ChildTabs = ({ childhighlightedrowid }: ChildTabsProps) => {
    const tabs = tabList.filter((tab) => tab.iTechDataWebTabParentRowId == childhighlightedrowid);
    const selectedTab = tabList.find(
      (tab) => tab.iTechDataWebTabParentRowId == childhighlightedrowid && tab.isHightlighted == true
    );

    const highlightedparentrowid: number | undefined = selectedTab?.rowId;

    return (
      <>
        {tabs && tabs.length > 0 ? (
          <>
            <Tabs
              value={selectedTab ? selectedTab.path : tabs.length}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="tabs"
            >
              {tabs.map((page, i) => (
                <TabItem
                  key={page.path}
                  label={page.name}
                  value={page.path}
                  component={Link}
                  to={page.path}
                  item={page}
                  //innerRef={elRefs.current[i]}
                  i={i}
                  elRefs={elRefs}
                  menuRef={menuRef}
                  onEdit={() => handleFormOpen("edittab", page)}
                  onDelete={() => handleFormOpen("delete", page)}
                  onSetTabIndex={_setTabIndex}
                  setCurrentTab={setCurrentTab}
                  canDelete={tabs.length > 1}
                />
              ))}
              {!selectors.getCaseClosed() && parentMenu && (
                <ButtonInTabs parentRowID={childhighlightedrowid}>Add Tab</ButtonInTabs>
              )}
            </Tabs>
            {highlightedparentrowid && highlightedparentrowid != null ? (
              <ChildTabs childhighlightedrowid={highlightedparentrowid} />
            ) : null}
          </>
        ) : null}
      </>
    );
  };

  const selectedTab = tabList.find(
    (tab: ITechDataWebTabExtended) =>
      tab.iTechDataWebTabParentRowId == null && tab.isHightlighted == true // || tab.selected == true)
  );

  const topLevelTabs = tabList?.filter((tab) => tab.iTechDataWebTabParentRowId == null);
  //const style = getCaseStatusStyle(selectors, theme);

  return (
    <div className={classes.appBarContainer}>
      <AppBar
        position="static"
        elevation={0}
        className={clsx({
          [classes.closed]: selectors.getCaseClosed(),
        })}
      >
        <Tabs
          value={selectedTab ? selectedTab.path : tabList.length}
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="tabs"
          ref={menuRef}
          // innerRef={menuRef}
          TabIndicatorProps={{
            style: { marginBottom: "5px", backgroundColor: theme.palette.primary.main },
          }}
        >
          {topLevelTabs &&
            topLevelTabs.map((page, i) => (
              <TabItem
                key={page.path}
                label={page.name}
                value={page.path}
                component={Link}
                to={page.path}
                item={page}
                //innerRef={elRefs.current[i]}
                i={i}
                elRefs={elRefs}
                menuRef={menuRef}
                onEdit={() => handleFormOpen("edittab", page)}
                onDelete={() => handleFormOpen("delete", page)}
                onSetTabIndex={_setTabIndex}
                setCurrentTab={setCurrentTab}
                canDelete={topLevelTabs.length > 1}
              />
            ))}
          {!selectors.getCaseClosed() && parentMenu && (
            <ButtonInTabs parentRowID={null}>Add Tab</ButtonInTabs>
          )}
        </Tabs>
        {/*         {highlightedrowid && highlightedrowid != null ? (
          <ChildTabs childhighlightedrowid={highlightedrowid}></ChildTabs>
        ) : null} */}
      </AppBar>
    </div>
  );
};

export default TabList;
