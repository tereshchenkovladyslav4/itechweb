import React, { useEffect, useState } from "react";
import { ITechDataWebMenuExtended } from "../Model/Extended/ITechDataWebMenuExtended";
import IconManager from "../_components/IconManager";
import { ITechDataWebTabExtended } from "../Model/Extended/ITechDataWebTabExtended";
import { MenuAction } from "./MenuFunction";
import { ITechDataWebTemplate } from "../Model/iTechRestApi/ITechDataWebTemplate";
import { resultsService } from "../_services/resultsService";
import { ITechResultSet } from "../Model/iTechRestApi/ITechResultSet";
import { authenticationService } from "../_services/authenticationService";
import {
  AddSavedResultEvent,
  ApplySavedResultSetEvent,
  off,
  on,
  ResultSetEvent,
  trigger,
  UpdateMenusEvent,
} from "../_helpers/events";
import { templateService } from "../_services/templateService";
import { useStore } from "../_context/Store";
import { ApplyTemplateRequest } from "../Model/iTechRestApi/ApplyTemplateRequest";
import { pathBuilder } from "../_helpers/pathBuilder";
import { AdvancedFilterModel } from "../Model/iTechRestApi/AdvancedFilterModel";
import { applyFiltersAction, applyTreeFiltersAction } from "../_context/actions/PageDataActions";
import { setTemplatesAction } from "../_context/actions/TemplateActions";
import { caseService } from "../_services/caseService";
import { showErrorDialogAction } from "../_context/actions/HandleErrorActions";
import { useDataSources } from "../_context/thunks/dataSources";
import { tableService } from "../_services/tableService";
import { ConfirmItem, MenuTreeNodeType, NodeType, TreeNode } from "./TreeNode";
import Tree from "./Tree";
import ConfirmDialog from "../_components/ConfirmDialog";
import { iTechDataCaseStatusEnum } from "../Model/iTechRestApi/iTechDataCaseStatusEnum";
import { red } from "@mui/material/colors";
import { ITechDataWebFolderExtended } from "../Model/Extended/ITechDataWebFolderExtended";
import { handleFormFn } from "./MenuDisplay";
import { iTechDataWebFolderEnum } from "../Model/iTechRestApi/iTechDataWebFolderEnum";
import { menuService } from "../_services/menuService";

interface IMenuTreeProps {
  menuList: Array<ITechDataWebMenuExtended>;
  onSetCurrentMenu: (item: any) => void;
  onAddTab: (tab: ITechDataWebTabExtended) => void;
  onAction: handleFormFn;
  resultsService: typeof resultsService;
  templateService: typeof templateService;
  caseService: typeof caseService;
  setTabList: (list: ITechDataWebTabExtended[]) => void;
  setCurrentTab: (position: number) => void;
}

const MenuTree: React.FC<IMenuTreeProps> = ({
  menuList,
  onSetCurrentMenu,
  onAction,
  resultsService,
  templateService,
  caseService,
  setTabList,
  setCurrentTab,
}) => {
  const { dispatch, selectors, state } = useStore();
  const [filteredMenus, setFilteredMenus] = useState<ITechDataWebMenuExtended[]>([]);
  const [cases, setCases] = useState<ITechDataWebMenuExtended[] | undefined>(undefined);
  const [views, setViews] = useState<ITechDataWebTemplate[]>([]);
  const [savedResults, setSavedResults] = useState<ITechResultSet[] | undefined>();
  const [caseStatus, setCaseStatus] = useState<Map<number, number>>();
  const currentUserId = authenticationService.currentUserId;
  const dataSourceList = useDataSources(tableService.getAll);
  const [showConfirm, setShowConfirm] = useState<ConfirmItem | undefined>(undefined);
  const userRootIcon = "MenuBook";
  const companyRootIcon = "Business";

  const [topLevelNodes, setTopLevelNodes] = useState<TreeNode[]>([
    // Can uncomment these to re-enable this functionality
    // { name: "Saved Results", id: -10, icon: "storage", children: [], rowId: -1 },
    // { name: "Views", id: -11, icon: "visibility", children: [], rowId: -1 },
  ]);

  const resultsAndViewsEnabled = topLevelNodes.findIndex((t) => t.icon === "visibility") !== -1;

  const getFolderIcon = (folder: ITechDataWebFolderExtended) => {
    switch (folder.iTechDataWebFolderTypeRowId) {
      case iTechDataWebFolderEnum.standard:
        return companyRootIcon;
      case iTechDataWebFolderEnum.user:
        return userRootIcon;
      case iTechDataWebFolderEnum.case:
        return "workOutline";
      default:
        return "FolderOpen";
    }
  };

  const getTopLevelFolders = (folders: ITechDataWebFolderExtended[]) => {
    const nodes: TreeNode[] = [];
    let startId = -1;
    folders.forEach((f) => {
      nodes.push({
        name: f.name,
        id: startId--,
        rowId: f.rowId,
        children: [],
        icon: getFolderIcon(f),
        nodeType: NodeType.folder,
        type: mapFolderToTreeNodeType(f.iTechDataWebFolderTypeRowId),
        isOwner: true,
      });
    });
    return nodes;
  };

  const mapFolderToTreeNodeType = (id: number | null): MenuTreeNodeType | undefined => {
    if (id === null) return undefined;
    const types: MenuTreeNodeType[] = [
      MenuTreeNodeType.standard,
      MenuTreeNodeType.page,
      MenuTreeNodeType.case,
    ];
    return types[id - 1];
  };

  let i = 0;

  const mapFoldersToNodes = (folders: ITechDataWebFolderExtended[]) => {
    // populate the currently 3 top level nodes ( standard / user / case )
    let topNodes = topLevelNodes;
    if (topLevelNodes.length <= 2) {
      // setup the api returned folders
      const newFolders = getTopLevelFolders(folders);
      if (newFolders && newFolders.length) {
        topNodes = [...newFolders, ...topLevelNodes];
        setTopLevelNodes(topNodes);
      }
    }
  };

  const visitFolders = (
    folders: ITechDataWebFolderExtended[],
    action: (folder: ITechDataWebFolderExtended) => void
  ) => {
    folders.forEach((f) => {
      action(f);
      if (f.iTechDataWebFolders && f.iTechDataWebFolders.length) {
        visitFolders(f.iTechDataWebFolders, action);
      }
    });
  };

  // for the selected id and node type return the id of the corresponding tree node
  const visitTreeNodes = (tree: TreeNode[], nodeType: NodeType, selectedRowId: number): number => {
    for (let i = 0; i < tree.length; i++) {
      const t = tree[i];
      if (t.rowId === selectedRowId && t.nodeType === nodeType) {
        return t.id;
      }
      if (t.children && t.children.length) {
        const id = visitTreeNodes(t.children, nodeType, selectedRowId);
        if (id != -1) {
          return id;
        }
      }
    }
    return -1; // not found
  };

  let stack: number[] = [];

  const treeNodesParent = (tree: TreeNode[], nodeType: NodeType, selectedRowId: number): number => {
    for (let i = 0; i < tree.length; i++) {
      const t = tree[i];
      if (t.id < 0) {
        // only negative on top level nodes
        stack = [];
      }
      stack.push(t.id);
      if (t.rowId === selectedRowId && t.nodeType === nodeType) {
        return stack[0];
      }
      if (t.children && t.children.length) {
        const id = treeNodesParent(t.children, nodeType, selectedRowId);
        if (id != -99) {
          return id;
        }
      }
    }
    return -99; // not found
  };

  // this only maps at top level currently - will need to visit folders off menu items too
  const mapFolders = () => {
    const folders = selectors.getFolders();
    folders.forEach((f) => {
      const topLevelIndex = topLevelNodes.findIndex((t) => t.icon === getFolderIcon(f));
      if (f.iTechDataWebFolderTypeRowId == 1) {
        mapTree(topLevelNodes[topLevelIndex], f, MenuTreeNodeType.standard);
      } else if (f.iTechDataWebFolderTypeRowId == 2) {
        mapTree(topLevelNodes[topLevelIndex], f, MenuTreeNodeType.page);
      } else if (f.iTechDataWebFolderTypeRowId == 3) {
        mapTree(topLevelNodes[topLevelIndex], f, MenuTreeNodeType.case);
      }
    });
    // cause state change to re-render tree ( for delete case where the only state passed to tree thats changing is the nodes )
    setTopLevelNodes([...topLevelNodes]);
  };

  useEffect(() => {
    if (topLevelNodes.length > 2) {
      mapFolders();
    }
  }, [selectors.getFolders()]); // redraw if folder changed

  const mapTree = (
    parent: TreeNode,
    folder: ITechDataWebFolderExtended,
    type: MenuTreeNodeType
  ) => {
    const pages = folder.iTechDataWebMenus
      .sort((x, y) => x.name.localeCompare(y.name))
      .map(
        (x) =>
          ({
            name: x.name,
            rowId: x.rowId,
            id: i++,
            icon: x.icon,
            type: type,
            isOwner: true,
            nodeType: NodeType.menu,
            folderId: folder.rowId,
            color:
              type === MenuTreeNodeType.case &&
              caseStatus &&
              x.iTechDataWebTabs[0]?.iTechDataCaseRowId
                ? caseStatus.has(x.iTechDataWebTabs[0].iTechDataCaseRowId) &&
                  caseStatus.get(x.iTechDataWebTabs[0].iTechDataCaseRowId) ===
                    iTechDataCaseStatusEnum.closed
                  ? red[300]
                  : undefined
                : undefined,
            children: x.iTechDataWebTabs.map((c) => ({
              name: c.name,
              rowId: c.rowId,
              id: i++,
              icon: "tab", // if this changes also modify MenuDisplay._removeObject
              type: type,
              isOwner: true,
              fixed: c.fixed,
              nodeType: NodeType.tab,
            })),
          } as TreeNode)
      );
    const folders = folder.iTechDataWebFolders.sort((x, y) => x.name.localeCompare(y.name));
    const folderNodes = folders.map(
      (x) =>
        ({
          name: x.name,
          rowId: x.rowId,
          id: i++,
          icon: "FolderOpen",
          type: type,
          isOwner: true,
          nodeType: NodeType.folder,
        } as TreeNode)
    );
    for (let i = 0; i < folders.length; i++) {
      const fn = folderNodes[i];
      const f = folders[i];

      mapTree(fn, f, type);
    }

    parent.children = [...folderNodes, ...pages];
  };

  const populateFolders = () => {
    const folders = selectors.getFolders();
    if (folders && folders.length) {
      mapFoldersToNodes(folders);
    }
  };

  const populateSavedResults = () => {
    const index = topLevelNodes.findIndex((t) => t.icon === "storage");

    if (index === -1) return; // save results not configured

    const owners: (string | null)[] = [
      ...new Set(
        savedResults?.map((item) =>
          item.forename ? item.forename + (item.surname ? " " + item.surname : "") : null
        )
      ),
    ];

    topLevelNodes[index].children = owners.map((x) => {
      const node: TreeNode = {
        name: x || "",
        id: i++,
        icon: "person",
        rowId: -1,
      };

      // handle 0/1 name values
      const names: (string | null)[] = x ? x.split(" ") : [null, null];
      if (names.length === 1) names.push(null);

      node.children = savedResults
        ?.filter((x) => x.forename === names[0] && x.surname === names[1])
        .map((x) => {
          // get the icon / description for the controltable entry if present
          const dsItem = dataSourceList.find((s) => s.rowId === x.iTechControlTableRowId);
          return {
            name: x.name + " (" + dsItem?.description + ")",
            rowId: x.rowId,
            id: i++,
            icon: dsItem?.icon || "star",
            isOwner: x.securityRowId === currentUserId,
            type: MenuTreeNodeType.savedResult,
          } as TreeNode;
        });
      return node;
    });
  };

  const populateViews = () => {
    const index = topLevelNodes.findIndex((t) => t.icon === "visibility");
    if (index === -1) return; // views not configured

    const viewNodes = views
      .sort((x, y) => x.name.localeCompare(y.name))
      .map(
        (t) =>
          ({
            id: i++,
            name: t.name,
            type: MenuTreeNodeType.view,
            isOwner: true, // TBD - can views be deleted by anyone ?
            icon: "ViewCompact",
            rowId: t.rowId,
          } as TreeNode)
      );

    topLevelNodes[index].children = viewNodes;
  };

  populateFolders();
  populateSavedResults();
  populateViews();

  // get the id of the node that is selected
  const getPageIndex = () => {
    const menuSelected = menuList.find((m) => m.selected === true);
    const menuId = menuSelected?.rowId;
    if (menuId) {
      const i = visitTreeNodes(
        topLevelNodes, //.slice(0, topLevelNodes.length - 2), // slice off saved results / views folders ( these removed )
        NodeType.menu,
        menuId
      );
      return i;
    }
    return 0;
  };

  useEffect(() => {
    if (menuList?.length) {
      setFilteredMenus(menuList.filter((m) => m.iTechDataSecurityObjectRowId !== null));
      setCases(menuList.filter((m) => m.iTechDataSecurityObjectRowId === null));
    }
  }, [menuList, caseStatus]);

  const _handleAddSavedResult = () => {
    loadSavedResults();
  };

  useEffect(() => {
    on(UpdateMenusEvent, loadAllCaseStatus);

    if (resultsAndViewsEnabled) {
      on(AddSavedResultEvent, _handleAddSavedResult);
      loadSavedResults();
      loadViews();
    }

    loadAllCaseStatus();

    return () => {
      if (resultsAndViewsEnabled) {
        off(AddSavedResultEvent, _handleAddSavedResult);
      }
      off(UpdateMenusEvent, loadAllCaseStatus);
    };
  }, []);

  useEffect(() => {
    if (resultsAndViewsEnabled) {
      const viewList = selectors.getViews();
      if (viewList?.length) {
        setViews(viewList);
      }
    }
  }, [state.templates]);

  const loadViews = () => {
    templateService.getAll().then(
      (templates) => {
        dispatch(setTemplatesAction(templates));
      },
      () => {
        // dispatch(
        //   showErrorDialogAction(SideMenuTree.displayName, error?.message)
        // );
      }
    );
  };

  const loadAllCaseStatus = () => {
    caseService.getCaseStatus().then((casestatus) => {
      const statusMap = new Map<number, number>(
        casestatus.map((x) => [x.rowId, x.iTechDataCaseStatusTypeRowId] as [number, number])
      );
      setCaseStatus(statusMap);
    });
  };

  const loadSavedResults = () => {
    resultsService.getAll().then(
      (results) => {
        setSavedResults(results.sort((x, y) => x.name.localeCompare(y.name)));
      },
      () => {
        // dispatch(
        //   showErrorDialogAction(SideMenuTree.displayName, error?.message)
        // );
      }
    );
  };

  const _onSelectedCase = (node: TreeNode) => {
    const selectedCase = cases?.find((x) => x.rowId === node.rowId);
    if (selectedCase) {
      // N.B. path must always include the tab - now that we have folders it is always assumed when finding the selected
      //      page/case from a url that the last part is the tab name
      const selectedTab =
        selectedCase.iTechDataWebTabs.find((x) => x.selected) || selectedCase.iTechDataWebTabs[0];
      const url = `${window.location.origin.toString()}${selectedTab?.path}`;
      window.open(url, "_blank");
    } else {
      // case tab
      if (node.nodeType === NodeType.tab && node.rowId) {
        cases?.some((c) => {
          const tab = c.iTechDataWebTabs.find((t) => t.rowId === node.rowId);
          if (tab) {
            const url = `${window.location.origin.toString()}${tab.path}`;
            window.open(url, "_blank");
          }
          return !!tab;
        });
      }
    }
  };

  const _setSelectedPageOrCase = (items: ITechDataWebMenuExtended[], node: TreeNode): void => {
    // rowId on a tab could also be used for a page.. so check node type
    if (node.nodeType != NodeType.tab) {
      const page = items.find((x) => x.rowId === node.rowId);
      if (page) {
        onSetCurrentMenu(page);
      }
    } else {
      // tab
      if (node.rowId) {
        // check if current page
        const currentPage = items.find((m) => m.selected === true);
        const IsCurrentPageTab = currentPage?.iTechDataWebTabs.some((x) => x.rowId === node.rowId);
        if (IsCurrentPageTab) {
          setCurrentTab(node.rowId);
        } else {
          items.some((m) => {
            const tab = m.iTechDataWebTabs.find((t) => t.rowId === node.rowId);
            if (tab) {
              tab.selected = true;
              authenticationService.updateTab(tab.rowId);

              onSetCurrentMenu(m);
              // if we call this and dont set tab selected etc above, end up with a tab[0] history entry then the correct tab
              // setCurrentTab(tab.rowId);
            }
            return !!tab;
          });
        }
      }
    }
  };

  const _onSelectedPage = (node: TreeNode) => {
    _setSelectedPageOrCase(filteredMenus, node);
  };

  const _onSelectedView = (node: TreeNode) => {
    const template: ITechDataWebTemplate =
      views.find((t) => t.rowId === node.rowId) || new ITechDataWebTemplate();
    const { menuId, tabId } = selectors.getSelectedMenuAndTab();
    const applyTemplate: ApplyTemplateRequest = {
      template: template,
      selectedMenuItemId: menuId || null,
      selectedTabId: tabId || null,
    };
    templateService.apply(applyTemplate).then(
      (response) => {
        const newTab = response;
        newTab.isHightlighted = true;

        const currentMenu = menuList.find((m) => m.selected === true);
        const tabs = [...(currentMenu?.iTechDataWebTabs || [])];
        newTab.path = `${currentMenu?.path}${pathBuilder([newTab.name])}`;
        tabs.forEach((tab) => (tab.isHightlighted = false));
        tabs.push(newTab);

        // TODO: these two called in tandem is a bit inefficient - have combined method to not update menulist in store twice
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
      () => {
        // dispatch(
        //   showErrorDialogAction(SideMenuTree.displayName, error?.message)
        // );
      }
    );
  };

  const isEnabled = () => !selectors.getCaseClosed();

  const _onClick = (node: TreeNode, e?: any) => {
    e?.preventDefault();
    if (node.type === undefined) return;

    switch (node.type) {
      case MenuTreeNodeType.page:
      case MenuTreeNodeType.standard:
        _onSelectedPage(node);
        break;
      case MenuTreeNodeType.case:
        _onSelectedCase(node);
        break;
      case MenuTreeNodeType.view:
        if (isEnabled()) {
          _onSelectedView(node);
        }
        break;
      case MenuTreeNodeType.savedResult:
        if (isEnabled()) {
          _handleSelectSavedResult(node);
        }
        break;
    }
  };

  const _handleSelectSavedResult = (item: TreeNode) => {
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

  const _setInCurrentBrowserTab = (e: any, item: TreeNode) => {
    e.stopPropagation();
    if (item.rowId === undefined || !cases) return;

    _setSelectedPageOrCase(cases, item);
  };

  const _handleDeleteView = (item: ITechDataWebTemplate) => {
    templateService.remove(item.rowId).then(
      () => {
        templateService.getAll().then(
          (templates) => {
            dispatch(setTemplatesAction(templates));
          },
          (error) => {
            dispatch(showErrorDialogAction(MenuTree.displayName, error?.message));
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
  const _handleDeleteFolder = (item: ITechDataWebFolderExtended) => {
    menuService.removeFolder(item.rowId).then(() => {
      trigger(UpdateMenusEvent);
    });
  };

  const pageIndex = getPageIndex();

  const getAction = (node: TreeNode): MenuAction[] => {
    if (!node.type) return [];

    const isPage = node.nodeType === NodeType.menu;

    // map from page id to the case id ( caseservice archives the case & any pages )
    const getCaseForPage = (item: TreeNode): TreeNode | undefined => {
      const caseId = cases?.find((x) => x.rowId === item.rowId)?.iTechDataWebTabs[0]
        ?.iTechDataCaseRowId;
      if (!caseId) return undefined;
      const node = new TreeNode();
      node.rowId = caseId;
      node.name = item.name;
      return node;
    };

    const userOrCompanyNodes = topLevelNodes.filter(
      (t) => t.icon === userRootIcon || t.icon === companyRootIcon
    );
    let rootIcon: string | undefined = userRootIcon;
    if (userOrCompanyNodes && userOrCompanyNodes.length && node.nodeType === NodeType.menu) {
      stack = [];
      const rootId = treeNodesParent(userOrCompanyNodes, NodeType.menu, node.rowId);
      //console.log(`rootid: ${rootId} nodeId:${node.rowId}`)
      if (rootId != -99) {
        rootIcon = topLevelNodes.find((x) => x.id === rootId)?.icon;
      }
    }

    // N.B. order matches MenuTreeNodeType enum
    const nodeActions: MenuAction[][] = [
      [],
      // page
      [
        {
          icon: (
            <IconManager
              fontSize="small"
              icon="Edit"
              onClick={() =>
                onAction(isPage ? "editmenu" : "edittab", { ...node, ...{ root: rootIcon } })
              }
            />
          ),
          name: isPage ? "Edit page" : "Edit tab",
          id: 2,
          toolTipPlacement: "bottom",
        },
        {
          icon: (
            <IconManager fontSize="small" icon="Delete" onClick={() => onAction("delete", node)} />
          ),
          name: "Delete",
          id: 3,
          toolTipPlacement: "bottom",
        },
      ],
      // case
      [
        {
          icon: (
            <IconManager
              fontSize="small"
              icon="Delete"
              onClick={() => onAction("deleteCase", getCaseForPage(node))}
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
          id: 4,
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
              onClick={() =>
                setShowConfirm({
                  rowId: node.rowId,
                  title: `Delete Saved Result - ${node.name}`,
                  nodeType: MenuTreeNodeType.savedResult,
                })
              }
            />
          ),
          name: "Delete",
          id: 3,
          toolTipPlacement: "bottom",
        },
      ], // view
      [
        {
          icon: (
            <IconManager
              fontSize="small"
              icon="Delete"
              onClick={() =>
                setShowConfirm({
                  rowId: node.rowId,
                  title: `Delete View - ${node.name}`,
                  nodeType: MenuTreeNodeType.view,
                })
              }
            />
          ),
          name: "Delete",
          id: 3,
          toolTipPlacement: "bottom",
        },
      ],
    ];

    const folderActions: MenuAction[] = [
      {
        icon: (
          <IconManager fontSize="small" icon="Add" onClick={() => onAction("addfolder", node)} />
        ),
        name: "Add Folder",
        id: 1,
        toolTipPlacement: "bottom",
      },
      {
        icon: (
          <IconManager
            fontSize="small"
            icon="PostAdd"
            onClick={() =>
              onAction("editmenu", { folderId: node.rowId, root: rootIcon } as unknown as TreeNode)
            }
          />
        ),
        name: "Add Page",
        id: 2,
        toolTipPlacement: "bottom",
      },
      {
        icon: (
          <IconManager
            fontSize="small"
            icon="Delete"
            onClick={() =>
              setShowConfirm({
                rowId: node.rowId,
                title: `Delete Folder - ${node.name}`,
                nodeType: MenuTreeNodeType.page,
              })
            }
          />
        ),
        name: "Delete",
        id: 3,
        toolTipPlacement: "bottom",
      },
    ];
    const caseActions: MenuAction[] = [
      {
        icon: (
          <IconManager
            fontSize="small"
            icon="Edit"
            onClick={() => onAction("folderproperties", node)}
          />
        ),
        name: "Folder properties",
        id: 10,
        toolTipPlacement: "bottom",
      },
    ];

    // different actions for folders
    if (node.nodeType === NodeType.folder) {
      const folders = selectors.getFolders();
      const topLevelNode = folders.find((x) => x.rowId == node.rowId);
      // no delete if top level node
      if (topLevelNode) {
        // only add page if  user / standard ( company ) node
        const count =
          topLevelNode.iTechDataWebFolderTypeRowId === iTechDataWebFolderEnum.case ? 1 : 2;
        return folderActions.slice(0, count);
      }
      // check if the node is in user tree or standard tree
      const userOrCompanyNodes = topLevelNodes.filter(
        (t) => t.icon === userRootIcon || t.icon === companyRootIcon
      );
      if (userOrCompanyNodes && userOrCompanyNodes.length) {
        const i = visitTreeNodes(userOrCompanyNodes, NodeType.folder, node.rowId);
        if (i !== -1) {
          return folderActions;
        }
      }
      // no add page / delete - just add folder
      return folderActions.slice(0, 1);
    }

    // for standard node - use same actions as page
    const actions =
      node.type === MenuTreeNodeType.standard
        ? nodeActions[MenuTreeNodeType.page]
        : nodeActions[node.type];
    if (node.nodeType === NodeType.menu && node.type === MenuTreeNodeType.case) {
      return actions.concat(caseActions);
    }
    return actions;
  };

  const onCloseConfirm = () => {
    setShowConfirm(undefined);
  };

  const onDelete = () => {
    const item = showConfirm;
    if (item) {
      if (item.nodeType === MenuTreeNodeType.savedResult) {
        resultsService.remove(item.rowId).then(
          () => {
            // remove the deleted item from state
            setSavedResults((prev) => prev?.filter((x: any) => x.rowId !== item.rowId));
          },
          (error) => {
            dispatch(showErrorDialogAction(MenuTree.displayName, error?.message || error));
          }
        );
      } else if (item.nodeType === MenuTreeNodeType.view) {
        const view = views.find((x) => x.rowId === item.rowId);

        if (view) {
          _handleDeleteView(view);
        }
      } else if (item.nodeType === MenuTreeNodeType.page) {
        // page type is used for folders
        const folders = selectors.getFolders();

        let folder: ITechDataWebFolderExtended | null = null;
        visitFolders(folders, (f: ITechDataWebFolderExtended) => {
          if (f.rowId === item.rowId) {
            folder = f;
          }
        });

        if (folder) {
          _handleDeleteFolder(folder);
        }
      }
      setShowConfirm(undefined);
    }
  };

  const getNodeHierarchy = (
    tree: TreeNode[],
    nodeType: NodeType,
    selectedRowId: number
  ): number[] => {
    for (let i = 0; i < tree.length; i++) {
      const t = tree[i];
      if (t.rowId === selectedRowId && t.nodeType === NodeType.menu) {
        return [t.id];
      }
      if (t.children && t.children.length) {
        const ids = getNodeHierarchy(t.children, nodeType, selectedRowId);
        if (ids.length) {
          return [t.id, ...ids];
        }
      }
    }
    return []; // not found
  };

  // get the hierarchy of folder ids to the selected page
  const getNodes = () => {
    const menuSelected = menuList.find((m) => m.selected === true);
    const menuId = menuSelected?.rowId;
    const nodes = topLevelNodes; //.slice(0, topLevelNodes.length - 2); // sved results / views removed
    if (menuId && nodes.length) {
      const ids = getNodeHierarchy(nodes, NodeType.folder, menuId);
      const folderIds = Array.from(ids.slice(0, ids.length - 1), (x) => `${x}`);
      return folderIds;
    }
    return [];
  };
  const expandedNodes = [...new Set(["-2", "-3"].concat(getNodes()))];

  return (
    <div>
      {showConfirm && (
        <ConfirmDialog
          title={showConfirm.title}
          text="Are you sure?"
          show={showConfirm !== undefined}
          onClose={onCloseConfirm}
          onConfirm={onDelete}
        />
      )}

      <Tree
        nodes={topLevelNodes}
        onNodeClick={_onClick}
        getNodeActions={getAction}
        selectedNodeId={pageIndex}
        defaultExpanded={expandedNodes} // -2 user, -3 cases
      />
    </div>
  );
};

export default MenuTree;
