import { Toolbar } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import React, { useEffect, useState } from "react";
import { trackPromise } from "react-promise-tracker";
import { RouteProps, useHistory } from "react-router-dom";
import { ITechDataWebTabExtended } from "./Model/Extended/ITechDataWebTabExtended";
import { templateService } from "./_services/templateService";
import { tabService } from "./_services/tabService";
import { handleFormFn } from "./Menu/MenuDisplay";
import { ciEquals } from "./_helpers/utilities";
import { componentService } from "./_services/componentService";
import { ITechDataWebMenuExtended } from "./Model/Extended/ITechDataWebMenuExtended";
import { useStore } from "./_context/Store";
import { updateMenuListAction } from "./_context/actions/MenuActions";
import ResponsiveGrid from "./ResponsiveGrid/ResponsiveGrid";
import useAsyncError from "./_helpers/hooks/useAsyncError";
import TabList from "./Menu/TabList";

type InvestigationPageProps = {
  location: RouteProps["location"];
};

const InvestigationPage: React.FC<InvestigationPageProps> = ({ location }) => {
  const throwError = useAsyncError();
  const history = useHistory();
  const { dispatch } = useStore();
  const [tabs, setTabs] = useState<ITechDataWebTabExtended[]>([]);
  const parts = location?.pathname?.split("/");
  const dataSource = parts && parts.length >= 3 ? parts[2] : undefined;
  const rowId = parts && parts.length >= 4 ? Number(parts[3]) : undefined;
  const tabName = parts && parts.length >= 5 ? parts[4] : undefined;

  const _setCurrentTab = (rowId?: number, tabName?: string) => {
    setTabs((prev) => {
      const t = [...prev];
      if (rowId) {
        t.forEach((t) => {
          t.selected = t.rowId === rowId;
          t.isHightlighted = t.rowId === rowId;
        });
      } else if (tabName) {
        t.forEach((t) => {
          const equal = ciEquals(t.name, tabName);
          t.selected = equal;
          t.isHightlighted = equal;
        });
      }

      const currentTab = tabs.find((x) => x.selected);
      if (currentTab && currentTab.path) {
        history.push(currentTab.path);
      }
      return t;
    });
  };

  useEffect(() => {
    let isMounted = true;

    // // TEST DATA
    // const tabData = [
    //   {
    //     selected: true,
    //     isHightlighted: true,
    //     path: "/investigation/ds/1/tab 1",
    //     rowId: 1,
    //     name: "Tab 1",
    //     fixed: true,
    //   },
    //   {
    //     selected: false,
    //     path: "/investigation/ds/1/tab 2",
    //     rowId: 2,
    //     name: "Tab 2",
    //     fixed: true,
    //   },
    //   {
    //     selected: false,
    //     path: "/investigation/ds/1/tab 3",
    //     rowId: 3,
    //     name: "Tab 3",
    //     fixed: true,
    //   },
    // ] as ITechDataWebTabExtended[];

    // setTabs(tabData);

    // const menus = [
    //   {
    //     name: "investigation",
    //     iTechDataWebTabs: tabData,
    //     selected: true,
    //   },
    // ] as ITechDataWebMenuExtended[];

    // dispatch(updateMenuListAction(menus));

    if (dataSource) {
      if (rowId !== undefined) {
        // todo - need the datasource too?
        sessionStorage.setItem("investigationId", `${dataSource}:${rowId}`);
      }
      // get the "templates" linked to this datasource
      // N.B. template names per datasource should be unique
      trackPromise(templateService.get(dataSource), InvestigationPage.displayName).then(
        (templates) => {
          const basePath = parts?.slice(0, 4)?.join("/");
          if (isMounted) {
            // map into menu / tabs
            let tabsData = templates.map((t, index) => ({
              name: t.name,
              position: index,
              fixed: true,
              selected: index === 0,
              isHightlighted: index === 0,
              iTechDataWebComponents: t.iTechDataWebComponents,
              path: `${basePath}/${t.name}`,
              rowId: t.rowId, // Needs a rowId for tab item click to work.
            })) as ITechDataWebTabExtended[];

            // TEST - just look at first 6 when retrieving via "investigation/template/1"
            if (dataSource === "template") {
              tabsData = tabsData.filter((x) => (x?.position || 0) < 6);
            }

            setTabs(tabsData);

            const menus = [
              {
                name: "investigation",
                iTechDataWebTabs: tabsData,
                selected: true,
              },
            ] as ITechDataWebMenuExtended[];

            dispatch(updateMenuListAction(menus));

            if (tabName) {
              _setCurrentTab(undefined, tabName);
            }
          }
        },
        (error) => {
          // where the error is from an async action - we can't just dispatch to trigger the error boundary, need to rethrow
          throwError(new Error(error?.message || error));
        }
      );
    }

    return () => {
      isMounted = false;
    };
  }, [dataSource]);

  return (
    <div>
      <Page rowId={rowId} tabs={tabs} location={location} setCurrentTab={_setCurrentTab} />
    </div>
  );
};

interface IPageProps {
  rowId?: number;
  tabs: ITechDataWebTabExtended[];
  location: RouteProps["location"];
  setCurrentTab: (rowId: number) => void;
}

export interface MenuStyleProps {
  height: number;
}

const props: MenuStyleProps = {
  height: 48,
};

const useStyles = makeStyles((theme) => ({
  toolBar: {
    minHeight: (props: MenuStyleProps) => props.height,
    //backgroundColor: "#20242d", // from defaultColor in colorUtils.ts
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
  },
  content: {
    flexGrow: 1,
  },
  root: {
    backgroundColor: theme.palette.background.paper,
    height: "100vh",
  },
}));

// rowId will be set in sessionStorage and used similar to caseId in all api calls
const Page: React.FC<IPageProps> = ({ location, tabs, setCurrentTab }) => {
  const _setTabList = (tabs: ITechDataWebTabExtended[]) => {};
  const _handleFormOpen: handleFormFn = (currentForm, item) => {};
  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      {/* <AppBar
        position="fixed"
        color="secondary"
        style={{ backgroundColor: "#20242d" }}
      > */}
      <Toolbar disableGutters className={classes.toolBar}>
        <TabList
          location={location}
          tabList={tabs}
          setTabList={_setTabList}
          setCurrentTab={setCurrentTab}
          handleFormOpen={_handleFormOpen}
          tabService={tabService}
        />
      </Toolbar>
      {/* </AppBar> */}
      <main className={classes.content}>
        {tabs?.length > 0 && (
          <ResponsiveGrid
            parent={{ ...tabs?.find((t) => !!t.selected), fixed: true, hideDial: true }} // todo - see what grid actually needs of the selected tab props (rowId, fixed, tabType, hideDial)
            service={componentService}
          />
        )}
      </main>
    </div>
  );
};

InvestigationPage.displayName = "InvestigationPage";
export default InvestigationPage;
