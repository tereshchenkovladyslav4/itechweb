import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import StorageIcon from "@mui/icons-material/Storage";
import VisibilityIcon from "@mui/icons-material/Visibility";
import React, { useEffect, useState } from "react";
import { trackPromise } from "react-promise-tracker";
import makeStyles from '@mui/styles/makeStyles';
import { CircularProgress } from "@mui/material";

import TemplateItem from "./TemplateItem";
import { useStore } from "../../_context/Store";
import { ITechDataWebTemplate } from "../../Model/iTechRestApi/ITechDataWebTemplate";
import { templateService } from "../../_services/templateService";
import { showErrorDialogAction } from "../../_context/actions/HandleErrorActions";
import { setTemplatesAction } from "../../_context/actions/TemplateActions";
import { ApplyTemplateRequest } from "../../Model/iTechRestApi/ApplyTemplateRequest";
import { iTechDataWebTemplateEnum } from "../../Model/iTechRestApi/iTechDataWebTemplateEnum";
import {
  applyFiltersAction,
  applyTreeFiltersAction,
} from "../../_context/actions/PageDataActions";
import { pathBuilder } from "../../_helpers/pathBuilder";
import { resultsService } from "../../_services/resultsService";
import {
  ApplySavedResultSetEvent,
  ResultSetEvent,
  trigger,
} from "../../_helpers/events";
import { authenticationService } from "../../_services/authenticationService";
import { AdvancedFilterModel } from "../../Model/iTechRestApi/AdvancedFilterModel";
import { ITechResultSet } from "../../Model/iTechRestApi/ITechResultSet";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    overflowX: "auto",
    marginBottom: 60,
  },
}));

interface ITemplateListProps {
  loadingArea: string;
  type: iTechDataWebTemplateEnum;
  tabList: any;
  setTabList: (list: any[]) => void;
  setCurrentTab: (position: number) => void;
  parentMenu: any;
}

const TemplateList: React.FC<ITemplateListProps> = ({
  loadingArea,
  type,
  tabList,
  setTabList,
  setCurrentTab,
  parentMenu,
}: ITemplateListProps) => {
  const classes = useStyles();
  const { state, selectors, dispatch } = useStore();
  const [open, setOpen] = useState(true);
  const [templates, setTemplates] = useState<ITechDataWebTemplate[]>([]);
  const [savedResults, setSavedResults] = useState<
    ITechResultSet[] | undefined
  >();
  const [userId] = useState(
    authenticationService.currentUserId
  );

  useEffect(() => {
    trackPromise(templateService.getAll(), loadingArea).then(
      (templates) => {
        dispatch(setTemplatesAction(templates));
      },
      (error) => {
        dispatch(
          showErrorDialogAction(TemplateList.displayName, error?.message)
        );
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateService]);

  useEffect(() => {
    if (type === iTechDataWebTemplateEnum.view) {
      trackPromise(resultsService.getAll(), loadingArea).then(
        (results) => {
          setSavedResults(results);
        },
        (error) => {
          dispatch(
            showErrorDialogAction(TemplateList.displayName, error?.message)
          );
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  useEffect(() => {
    switch (type) {
      case iTechDataWebTemplateEnum.template:
        setTemplates(selectors.getTemplates() || []);
        break;
      case iTechDataWebTemplateEnum.view:
        setTemplates(selectors.getViews() || []);
        break;
      default:
        throw Error(`Unknown template of type ${type}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.templates]);

  const handleClick = (e?: any) => {
    // prevent closure when in side panel
    e?.stopPropagation();
    setOpen(!open);
  };

  const _handleSelectTemplate = (template: ITechDataWebTemplate) => {
    const {menuId, tabId} = selectors.getSelectedMenuAndTab();
    const applyTemplate: ApplyTemplateRequest = {
      template: template,
      selectedMenuItemId: menuId || null,
      selectedTabId: tabId || null,
    };

    trackPromise(templateService.apply(applyTemplate), loadingArea).then(
      (response) => {
        const newTab = response;
        const tabs = [...tabList];
        tabs.forEach((tab) => (tab.selected = false));
        newTab.selected = true;
        newTab.path = `${parentMenu.path}${pathBuilder([newTab.name])}`;
        tabs.push(newTab);
        setTabList(tabs);
        setCurrentTab(newTab.rowId);

        if (
          response.iTechDataWebFilter &&
          type === iTechDataWebTemplateEnum.view
        ) {
          response.iTechDataWebFilter.forEach((a: any) => {
            const appliedFilters: AdvancedFilterModel = JSON.parse(a.json);
            switch (a.iTechDataWebFilterTypeRowId) {
              case 1:
                dispatch(applyFiltersAction(appliedFilters));
                break;
              case 2:
                dispatch(applyTreeFiltersAction(appliedFilters));
                break;
              default:
                throw Error(
                  `Unknown template of type ${a.iTechDataWebFilterTypeRowId}`
                );
            }
          });
        }
      },
      (error) => {
        dispatch(
          showErrorDialogAction(TemplateList.displayName, error?.message)
        );
      }
    );
  };

  const _handleDeleteTemplate = (item: ITechDataWebTemplate) => {
    trackPromise(templateService.remove(item.rowId), loadingArea).then(
      () => {
        trackPromise(templateService.getAll(), loadingArea).then(
          (templates) => {
            dispatch(setTemplatesAction(templates));
          },
          (error) => {
            dispatch(
              showErrorDialogAction(TemplateList.displayName, error?.message)
            );
          }
        );
      },
      () => {
        // Ignore now for.. dont want full page error if its a 404.. and handleresponse masks this being passed through due to react hook error
        // dispatch(
        //   showErrorDialogAction(TemplateList.displayName, error?.message)
        // );
      }
    );
  };

  const _handleSelectSavedResult = (item: any) => {
    // apply the savedresult set as the datasource for all grids in current view
    // if no grids show warning
    trigger(ApplySavedResultSetEvent, {
      rowId: item.rowId,
      dataSource: "ITechWebSavedResults",
      iTechControlTableRowId: item.iTechControlTableRowId,
      resultSetName:item.name,
    } as ResultSetEvent);
  };

  const _handleDeleteSavedResult = (item: any) => {
    trackPromise(resultsService.remove(item.rowId), loadingArea).then(
      () => {
        // remove the deleted item from state
        setSavedResults((prev) =>
          prev?.filter((x: any) => x.rowId !== item.rowId)
        );
      },
      (error) => {
        dispatch(
          showErrorDialogAction(TemplateList.displayName, error?.message)
        );
      }
    );
  };

  return (
    <>
      {type === iTechDataWebTemplateEnum.template ? (
        <List
          component="nav"
          aria-labelledby="nested-list-subheader"
          className={classes.root}
        >
          <ListItem button onClick={handleClick}>
            <ListItemIcon>
              <NoteAddIcon />
            </ListItemIcon>
            <ListItemText primary="Templates" />
            {templates?.length ? open ? <ExpandLess /> : <ExpandMore /> : null}
          </ListItem>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {templates?.map((item: any, i) => (
                <TemplateItem
                  item={item}
                  i={i}
                  key={item.name + i}
                  onSelect={() => _handleSelectTemplate(item)}
                  onDelete={() => _handleDeleteTemplate(item)}
                />
              ))}
            </List>
          </Collapse>
        </List>
      ) : type === iTechDataWebTemplateEnum.view ? (
        <List component="div" disablePadding>
          <ListItem>
            <ListItemIcon>
              <VisibilityIcon />
            </ListItemIcon>
            <ListItemText primary="Views" />
          </ListItem>
          {templates?.map((item: any, i) => (
            <TemplateItem
              item={item}
              i={i}
              key={item.name + i}
              onSelect={() => _handleSelectTemplate(item)}
              onDelete={() => _handleDeleteTemplate(item)}
            />
          ))}

          <ListItem>
            <ListItemIcon>
              <StorageIcon />
            </ListItemIcon>
            <ListItemText primary="Saved Results" />
            {savedResults ? null : <CircularProgress size={20} />}
          </ListItem>
          {savedResults?.map((item: any, i) => (
            <TemplateItem
              item={item}
              i={i}
              key={item.name + i}
              onSelect={() => _handleSelectSavedResult(item)}
              onDelete={() => _handleDeleteSavedResult(item)}
              showActions={item.securityRowId === userId}
            />
          ))}
        </List>
      ) : null}
    </>
  );
};

TemplateList.displayName = "TemplateList";

export default TemplateList;
