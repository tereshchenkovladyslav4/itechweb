import React, { useEffect, useState } from "react";
import { trackPromise } from "react-promise-tracker";
import { useStore } from "../../_context/Store";
import { ITechDataWebTemplate } from "../../Model/iTechRestApi/ITechDataWebTemplate";
import { templateService } from "../../_services/templateService";
import { showErrorDialogAction } from "../../_context/actions/HandleErrorActions";
import { setTemplatesAction } from "../../_context/actions/TemplateActions";
import { ApplyTemplateRequest } from "../../Model/iTechRestApi/ApplyTemplateRequest";
import { iTechDataWebTemplateEnum } from "../../Model/iTechRestApi/iTechDataWebTemplateEnum";
import { applyFiltersAction, applyTreeFiltersAction } from "../../_context/actions/PageDataActions";
import { pathBuilder } from "../../_helpers/pathBuilder";
import { AdvancedFilterModel } from "../../Model/iTechRestApi/AdvancedFilterModel";
import IconManager from "../../_components/IconManager";
import { MenuAction } from "../MenuFunction";
import { ConfirmItem, TemplateTreeNodeType, TreeNode } from "../TreeNode";
import Tree from "../Tree";
import ConfirmDialog from "../../_components/ConfirmDialog";

interface ITemplateTreeListProps {
  loadingArea: string;
  type: iTechDataWebTemplateEnum;
  tabList: any;
  setTabList: (list: any[]) => void;
  setCurrentTab: (position: number) => void;
  parentMenu: any;
}

const TemplateTreeList: React.FC<ITemplateTreeListProps> = ({
  loadingArea,
  type,
  tabList,
  setTabList,
  setCurrentTab,
  parentMenu,
}: ITemplateTreeListProps) => {
  const { state, selectors, dispatch } = useStore();
  const [templates, setTemplates] = useState<ITechDataWebTemplate[]>([]);
  const [showConfirm, setShowConfirm] = useState<ConfirmItem | undefined>(undefined);
  const applyEnabled = !selectors.getCaseClosed();

  useEffect(() => {
    trackPromise(templateService.getAll(), loadingArea).then(
      (templates) => {
        dispatch(setTemplatesAction(templates));
      },
      (error) => {
        dispatch(showErrorDialogAction(TemplateTreeList.displayName, error?.message));
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateService]);

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

  const _handleSelectTemplateNode = (node: TreeNode) => {
    // only if case not closed / or not a case
    if (applyEnabled) {
      const template = templates.find((x) => x.rowId === node.rowId);
      if (template) _handleSelectTemplate(template);
    }
  };

  const _handleSelectTemplate = (template: ITechDataWebTemplate) => {
    const { menuId, tabId } = selectors.getSelectedMenuAndTab();
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

        if (response.iTechDataWebFilter && type === iTechDataWebTemplateEnum.view) {
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
      (error) => {
        dispatch(showErrorDialogAction(TemplateTreeList.displayName, error?.message));
      }
    );
  };

  const [topLevelNodes] = useState<TreeNode[]>([
    type === iTechDataWebTemplateEnum.template
      ? { name: "Templates", id: -1, icon: "NoteAdd", children: [], rowId: -1 }
      : { name: "Views", id: -1, icon: "Visibility", children: [], rowId: -1 },
  ]);

  let i = 0;

  const populateNodes = () => {
    topLevelNodes[0].children = templates
      .sort((x, y) => x.name.localeCompare(y.name))
      .map(
        (x) =>
          ({
            name: x.name,
            rowId: x.rowId,
            id: i++,
            icon: "star",
            type: TemplateTreeNodeType.template,
            isOwner: true,
            children: [],
          } as TreeNode)
      );
  };

  populateNodes();

  const getAction = (node: TreeNode): MenuAction[] => {
    if (!node.type) return [];
    return [
      {
        icon: (
          <IconManager
            fontSize="small"
            icon="Delete"
            onClick={() =>
              setShowConfirm({
                rowId: node.rowId,
                title: `Delete Template - ${node.name}`,
                nodeType: TemplateTreeNodeType.template,
              })
            }
          />
        ),
        name: "Delete",
        id: 3,
        toolTipPlacement: "bottom",
      },
    ];
  };

  const onCloseConfirm = () => {
    setShowConfirm(undefined);
  };

  const onDelete = () => {
    const item = showConfirm;
    if (item) {
      if (item.nodeType === TemplateTreeNodeType.template) {
        trackPromise(templateService.remove(item.rowId), loadingArea).then(() => {
          trackPromise(templateService.getAll(), loadingArea).then(
            (templates) => {
              dispatch(setTemplatesAction(templates));
            },
            (error) => {
              dispatch(showErrorDialogAction(TemplateTreeList.displayName, error?.message));
            }
          );
        });
      }
    }
    setShowConfirm(undefined);
  };

  return (
    <>
      {showConfirm && (
        <ConfirmDialog
          title={showConfirm.title}
          text="Are you sure?"
          show={showConfirm !== undefined}
          onClose={onCloseConfirm}
          onConfirm={onDelete}
        />
      )}
      <div style={{ marginTop: 10 }}>
        <Tree
          nodes={topLevelNodes}
          onNodeClick={_handleSelectTemplateNode}
          getNodeActions={getAction}
        />
      </div>
    </>
  );
};

TemplateTreeList.displayName = "TemplateTreeList";

export default TemplateTreeList;
