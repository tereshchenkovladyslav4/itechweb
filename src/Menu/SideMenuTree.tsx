import React, { useEffect, useState } from "react";
import TreeView from "@mui/lab/TreeView";
import { ITechDataWebMenuExtended } from "../Model/Extended/ITechDataWebMenuExtended";
import { Typography } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import StyledTreeItem from "../Tree/StyledTreeItem";
import IconManager from "../_components/IconManager";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { MenuAction } from "./MenuFunction";
import Tippy from "@tippyjs/react";
import { Instance } from "tippy.js";
import { resultsService } from "../_services/resultsService";
import { ITechResultSet } from "../Model/iTechRestApi/ITechResultSet";
import { useStore } from "../_context/Store";
import { showErrorDialogAction } from "../_context/actions/HandleErrorActions";
import { ApplySavedResultSetEvent, ResultSetEvent, trigger } from "../_helpers/events";
import { ITechDataWebTemplate } from "../Model/iTechRestApi/ITechDataWebTemplate";
import { setTemplatesAction } from "../_context/actions/TemplateActions";
import { templateService } from "../_services/templateService";
import { ITechDataWebTabExtended } from "../Model/Extended/ITechDataWebTabExtended";
import { AdvancedFilterModel } from "../Model/iTechRestApi/AdvancedFilterModel";
import { pathBuilder } from "../_helpers/pathBuilder";
import { ApplyTemplateRequest } from "../Model/iTechRestApi/ApplyTemplateRequest";
import { applyFiltersAction, applyTreeFiltersAction } from "../_context/actions/PageDataActions";
import { caseService } from "../_services/caseService";
import MenuActions from "./MenuActions";
import { menuService } from "../_services/menuService";
import { savedResultsDataSourceMap } from "../_helpers/helpers";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 216,
    flexGrow: 1,
    maxWidth: 400,
  },
  labelRoot: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0.5, 0),
  },
  label: {
    width: "100%",
    display: "flex",
  },
  labelIcon: {
    marginRight: theme.spacing(1),
    color: theme.palette.grey[600],
  },
  labelNoIcon: {
    width: 14,
  },
  labelText: {
    fontWeight: "inherit",
    flexGrow: 1,
  },
  menuContainer: {
    height: 42,
    //display: grid, // If want menu as column replace height with these 2 entries
    // width: 42,
    "& button": {
      transform: "scale(0.8)",
    },
  },
}));

interface ICaseTreeProps {
  currentUser: number;
  // for views..
  tabList?: ITechDataWebTabExtended[];
  setTabList: (list: ITechDataWebTabExtended[]) => void;
  setCurrentTab: (position: number) => void;
  onSetCurrentMenu: (item: any) => void;
  parentMenu?: ITechDataWebMenuExtended | null;
}

enum nodeType {
  case = 1,
  view = 2,
  savedResult = 3,
}

class MenuTreeNode {
  id: number;
  name: string;
  children?: MenuTreeNode[];
  rowId?: number;
  icon?: string;
  type?: nodeType;
  isOwner?: boolean;
}

const SideMenuTree: React.FC<ICaseTreeProps> = ({
  currentUser,
  tabList,
  setTabList,
  setCurrentTab,
  onSetCurrentMenu,
  parentMenu,
}) => {
  const classes = useStyles();
  const topLevelNodes: MenuTreeNode[] = [
    { name: "Cases", id: -1, icon: "workOutline", children: [] },
    { name: "Saved Results", id: -2, icon: "storage", children: [] },
    { name: "Views", id: -3, icon: "visibility", children: [] },
  ];

  const [cases, setCases] = useState<ITechDataWebMenuExtended[] | undefined>();

  const [savedResults, setSavedResults] = useState<ITechResultSet[] | undefined>();

  const [templates, setTemplates] = useState<ITechDataWebTemplate[]>([]);
  const { state, selectors, dispatch } = useStore();

  let i = 0; // for unique node id

  const [selectedNodeId, setSelectedNodeId] = useState<number>();

  const populateSavedResults = () => {
    const owners: (string | null)[] = [
      ...new Set(
        savedResults?.map((item) =>
          item.forename ? item.forename + (item.surname ? " " + item.surname : "") : null
        )
      ),
    ];

    topLevelNodes[1].children = owners.map((x) => {
      const node: MenuTreeNode = {
        name: x || "",
        id: i++,
        icon: "person",
      };

      // handle 0/1 name values
      const names: (string | null)[] = x ? x.split(" ") : [null, null];
      if (names.length === 1) names.push(null);

      node.children = savedResults
        ?.filter((x) => x.forename === names[0] && x.surname === names[1])
        .map(
          (x) =>
            ({
              name:
                x.name +
                " (" +
                savedResultsDataSourceMap[x.iTechControlTableRowId || 0].replace("ITechWeb", "") +
                ")",
              rowId: x.rowId,
              id: i++,
              icon: "star", // TBD -> get the icon for the controltable entry?
              isOwner: x.securityRowId === currentUser,
              type: nodeType.savedResult,
            } as MenuTreeNode)
        );
      return node;
    });
  };

  const loadTemplates = () => {
    templateService.getAll().then(
      (templates) => {
        dispatch(setTemplatesAction(templates));
      },
      (error) => {
        dispatch(showErrorDialogAction(SideMenuTree.displayName, error?.message));
      }
    );
  };

  const populateCases = () => {
    if (cases) {
      const caseNodes = cases
        .sort((x, y) => x.name.localeCompare(y.name))
        .map(
          (x) =>
            ({
              name: x.name,
              rowId: x.rowId,
              id: i++,
              icon: x.icon,
              type: nodeType.case,
              isOwner: true,
              children: x.iTechDataWebTabs.map((c) => ({
                name: c.name,
                rowId: c.rowId,
                id: i++,
                icon: "tab",
              })),
            } as MenuTreeNode)
        );

      topLevelNodes[0].children = caseNodes;
    }
  };

  const populateTemplates = () => {
    const templateeNodes = templates
      .sort((x, y) => x.name.localeCompare(y.name))
      .map(
        (t) =>
          ({
            id: i++,
            name: t.name,
            type: nodeType.view,
            isOwner: true, // TBD - can views be deleted by anyone ?
            icon: "star",
            rowId: t.rowId,
          } as MenuTreeNode)
      );

    topLevelNodes[2].children = templateeNodes;
  };

  const _onSelectedCase = (node: MenuTreeNode) => {
    const selectedCase = cases?.find((x) => x.rowId === node.rowId);
    if (selectedCase) {
      //TODO - the tab name is not being appended to the path name. This needs adding when selected tab state work has been done. hard coded to case_files for now
      const url = `${window.location.origin.toString()}${selectedCase.path}`;
      window.open(url, "_blank");
    }
  };

  const _onSelectedTemplate = (node: MenuTreeNode) => {
    const template: ITechDataWebTemplate =
      templates.find((t) => t.rowId === node.rowId) || new ITechDataWebTemplate();

    const { menuId, tabId } = selectors.getSelectedMenuAndTab();

    const applyTemplate: ApplyTemplateRequest = {
      template: template,
      selectedMenuItemId: menuId || null,
      selectedTabId: tabId || null,
    };

    templateService.apply(applyTemplate).then(
      (response) => {
        const newTab = response;
        const tabs = [...(tabList || [])];
        tabs.forEach((tab) => (tab.isHightlighted = false));
        newTab.isHightlighted = true;

        newTab.path = `${parentMenu?.path}${pathBuilder([newTab.name])}`;

        tabs.push(newTab);
        setTabList(tabs);
        setCurrentTab(newTab.rowId);

        if (response.iTechDataWebFilter) {
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
                throw Error(`Unknown template of type ${a.iTechDataWebFilterTypeRowId}`);
            }
          });
        }
      },
      (error: any) => {
        dispatch(showErrorDialogAction(SideMenuTree.displayName, error?.message));
      }
    );
  };

  const onDeleteTemplate = (e: any, node: MenuTreeNode) => {
    e.stopPropagation();

    const template = templates.find((x) => x.rowId === node.rowId);

    if (template) {
      _handleDeleteTemplate(template);
    }
  };

  const _handleDeleteTemplate = (item: ITechDataWebTemplate) => {
    templateService.remove(item.rowId).then(
      () => {
        templateService.getAll().then(
          (templates) => {
            dispatch(setTemplatesAction(templates));
          },
          (error) => {
            dispatch(showErrorDialogAction(SideMenuTree.displayName, error?.message));
          }
        );
      },
      (error) => {
        // Ignore now for.. dont want full page error if its a 404.. and handleresponse masks this being passed through due to react hook error
        // dispatch(
        //   showErrorDialogAction(TemplateList.displayName, error?.message)
        // );
      }
    );
  };

  useEffect(() => {
    setTemplates(selectors.getViews() || []);
  }, [state.templates]);

  useEffect(() => {
    menuService.getCases().then(
      (results) => {
        setCases(results);
      },
      (error) => {
        dispatch(showErrorDialogAction(SideMenuTree.displayName, error?.message));
      }
    );
    resultsService.getAll().then(
      (results) => {
        setSavedResults(results.sort((x, y) => x.name.localeCompare(y.name)));
      },
      (error) => {
        dispatch(showErrorDialogAction(SideMenuTree.displayName, error?.message));
      }
    );
    loadTemplates();
  }, []);

  const _onClick = (node: MenuTreeNode, e?: any) => {
    e?.preventDefault();
    setSelectedNodeId(node.id);

    if (node.type === undefined) return;

    switch (node.type) {
      case nodeType.case:
        _onSelectedCase(node);
        break;
      case nodeType.view:
        _onSelectedTemplate(node);
        break;
      case nodeType.savedResult:
        _handleSelectSavedResult(node);
        break;
    }
  };

  const [instance, setInstance] = useState<Instance>();

  const hide = () => {
    instance?.hide();
  };

  const _handleSelectSavedResult = (item: MenuTreeNode) => {
    // apply the savedresult set as the datasource for all grids in current view
    // if no grids show warning

    // get the underlying datasource "type" for the selected result set
    const controlTableRowId = savedResults?.find(
      (x) => x.rowId === item.rowId
    )?.iTechControlTableRowId;

    trigger(ApplySavedResultSetEvent, {
      rowId: item.rowId,
      dataSource: "ITechWebSavedResults",
      iTechControlTableRowId: controlTableRowId,
      resultSetName: item.name,
    } as ResultSetEvent);
  };

  const _handleDeleteSavedResult = (e: any, item: MenuTreeNode) => {
    e.stopPropagation();
    if (item.rowId === undefined) return;

    resultsService.remove(item.rowId).then(
      () => {
        // remove the deleted item from state
        setSavedResults((prev) => prev?.filter((x: any) => x.rowId !== item.rowId));
      },
      (error) => {
        dispatch(showErrorDialogAction(SideMenuTree.displayName, error?.message));
      }
    );
  };

  const _handleDeleteCase = (e: any, item: MenuTreeNode) => {
    e.stopPropagation();
    if (item.rowId === undefined) return;

    caseService.remove(item.rowId).then(
      () => {
        // remove from state
        //setCaseList((prev) => prev?.filter((x: any) => x.rowId !== item.rowId));
      },
      (error) => {
        dispatch(showErrorDialogAction(SideMenuTree.displayName, error?.message));
      }
    );
  };

  const _setInCurrentBrowserTab = (e: any, item: MenuTreeNode) => {
    e.stopPropagation();
    if (item.rowId === undefined) return;
    const menu = cases?.find((x) => x.rowId === item.rowId);
    if (menu) {
      onSetCurrentMenu(menu);
    }
  };

  const _renderNode = (node: MenuTreeNode) => {
    // actions per node type
    const nodeActions: MenuAction[][] = [
      [],
      // case
      [
        {
          icon: (
            <IconManager
              fontSize="small"
              icon="Delete"
              onClick={(e: any) => _handleDeleteCase(e, node)}
            />
          ),
          name: "Delete",
          id: 3,
          toolTipPlacement: "bottom",
        },
        {
          icon: (
            <IconManager
              fontSize="small"
              icon="OpenInBrowser"
              onClick={(e: any) => _setInCurrentBrowserTab(e, node)}
            />
          ),
          name: "Open in Current Browser Tab",
          id: 3,
          toolTipPlacement: "bottom",
        },
      ],
      // view
      [
        {
          icon: (
            <IconManager
              fontSize="small"
              icon="Delete"
              onClick={(e: any) => onDeleteTemplate(e, node)}
            />
          ),
          name: "Delete",
          id: 3,
          toolTipPlacement: "bottom",
        },
      ],
      // saved results
      [
        {
          icon: (
            <IconManager
              fontSize="small"
              icon="Delete"
              onClick={(e: any) => _handleDeleteSavedResult(e, node)}
            />
          ),
          name: "Delete",
          id: 3,
          toolTipPlacement: "bottom",
        },
      ],
    ];

    return (
      <StyledTreeItem
        nodeId={String(node.id)}
        label={
          <div className={classes.labelRoot}>
            <Tippy
              interactive={true}
              placement="right"
              offset={[0, -20]}
              appendTo={document.body}
              delay={[500, 0]}
              animation="scale"
              hideOnClick={"toggle"}
              onCreate={(i) => setInstance(i)}
              content={
                <MenuActions
                  actions={node.isOwner && node.type ? nodeActions[node.type] : nodeActions[0]}
                  gid={node?.rowId || 0}
                  onClick={hide}
                  display="row"
                />
              }
            >
              <div className={classes.label}>
                {node?.icon ? (
                  <IconManager icon={node.icon} className={classes.labelIcon} />
                ) : (
                  <div className={classes.labelNoIcon} />
                )}
                <Typography variant="body2" className={classes.labelText}>
                  {node.name}
                </Typography>
              </div>
            </Tippy>
          </div>
        }
        key={node.id}
        onLabelClick={(e: any) => _onClick(node, e)}
      >
        {node.children && _renderChildren(node)}
      </StyledTreeItem>
    );
  };

  const _renderChildren = (node: MenuTreeNode) => {
    return node && node.children && node.children?.length > 0
      ? node.children.map((x: any) => _renderNode(x))
      : null;
  };

  // build the tree
  populateCases();
  populateSavedResults();
  populateTemplates();

  return (
    <div>
      <TreeView
        className={classes.root}
        // defaultExpanded={["-1"]}
        defaultCollapseIcon={<ArrowDropDownIcon />}
        defaultExpandIcon={<ArrowRightIcon />}
        selected={[`${selectedNodeId}`]}
        onClick={(e: any) => {
          e.stopPropagation(); // to stop closing of sidebar..
        }}
      >
        {topLevelNodes.map((n) => _renderNode(n))}
      </TreeView>
    </div>
  );
};

SideMenuTree.displayName = "SideMenuTree";

export default SideMenuTree;
