import React, { useState, useEffect, ReactElement } from "react";
import TreeView from "@mui/lab/TreeView";
import { MinusSquare, PlusSquare, CloseSquare } from "./Icons/TreeIcons";
import { trackPromise } from "react-promise-tracker";
import { treeService } from "../_services/treeService";
import { useStore } from "../_context/Store";
import {
  applyTreeFiltersAction,
  removeTreeFiltersAction,
} from "../_context/actions/PageDataActions";
import StyledTreeItem from "./StyledTreeItem";
import { v4 as uuidv4 } from "uuid";
import { AdvancedFilterModel } from "../Model/iTechRestApi/AdvancedFilterModel";
import { ITechControlTable } from "../Model/iTechRestApi/ITechControlTable";
import { off, on, RefreshTableEvent } from "../_helpers/events";
import { TableEnum } from "../Model/iTechRestApi/TableEnum";
import { useStyles } from "./TreeDisplay.styles";
import useIsMounted from "../_helpers/hooks/useIsMounted";
import { Box } from "@mui/material";

interface ITreeDisplayProps {
  config: any;
  area: any;
  service: typeof treeService;
}

const TreeDisplay: React.FC<ITreeDisplayProps> = ({ config, area, service }): ReactElement => {
  const { dispatch, selectors } = useStore();

  const dataSources = config.data;
  const _getTable = (node: any) => {
    return dataSources?.find((i: any) => i.rowId === node.iTechControlTableRowId);
  };

  const _onClickSelect = (node: any) => {
    const selectedTable = _getTable(node);
    // original code
    const treeFilterModel: AdvancedFilterModel = {
      name: "Tree",
      rowId: selectedTable.rowId,
      id: uuidv4(),
      dataSources: [
        {
          rowId: selectedTable.rowId,
          name: selectedTable.name,
          id: selectedTable.rowId,
          filters: node.expressions,
          rule: "AND",
        },
      ],
    };

    // dispatch a remove event ( for datasource ) if the node is a root node
    if (node.type === "Root") {
      const ds = Number(selectedTable.rowId) as TableEnum;
      dispatch(removeTreeFiltersAction(ds, config.filterGroupColor));
    } else {
      const appliedTreeFilters = selectors.getAppliedTreeFilters(config.filterGroupColor);
      if (
        !appliedTreeFilters ||
        appliedTreeFilters.dataSources.every((x) => x.rowId === selectedTable.rowId)
      ) {
        // replace / add whole filter
        dispatch(applyTreeFiltersAction(treeFilterModel, config.filterGroupColor));
      } else {
        // add to existing filters
        const otherDataSources = appliedTreeFilters.dataSources.filter(
          (x) => x.rowId !== selectedTable.rowId
        );
        const newFilter = { ...appliedTreeFilters };
        newFilter.dataSources = [...otherDataSources, ...treeFilterModel.dataSources];
        dispatch(applyTreeFiltersAction(newFilter, config.filterGroupColor));
      }
    }
  };

  return (
    <TreeDisplayRoot config={config} area={area} service={service} onClickSelect={_onClickSelect} />
  );
};

interface ITreeDisplayRootProps {
  config: any;
  area: any;
  service: typeof treeService;
  onClickSelect?: (node: any) => void;
  labelRender?: (node: any) => React.ReactNode;
}

const TreeDisplayRoot: React.FC<ITreeDisplayRootProps> = ({
  config,
  area,
  service,
  onClickSelect,
  labelRender,
}): ReactElement => {
  const classes = useStyles();
  const isMounted = useIsMounted();
  const [tree, setTree] = useState<any[]>([]);

  // if we want to be able to persist / reload the selected nodes on the tree per datasource - will need a consistent key to the nodes
  // currently the guid is just regenerated each load for each node in the api
  // const [selected, setSelected] = useState<DataSourceSelection[]>([]); // or could just use an object

  const dataSources = config.data;

  const roots = dataSources
    ? dataSources.map((root: ITechControlTable) => {
        return {
          guid: root?.rowId?.toString(),
          iTechControlTableRowId: root.rowId,
          name: root.description || root.name,
          keyTypeIndex: null,
          childNodes: [],
          expressions: [],
          type: "Root",
        };
      })
    : [{ id: 0, name: "Main", type: "Root", childNodes: [], expressions: [] }];

  const _getData = (node: any) =>
    trackPromise(service.get(_getKeyType(node)?.rowId, node.expressions), area);

  const _getKeyType = (node: any) => {
    const subItems = _getTable(node).subItems;
    const keyTypeIndex = node.keyTypeIndex === null ? 0 : node.keyTypeIndex;
    return subItems.find((i: any) => i.index === keyTypeIndex);
  };

  const _getTable = (node: any) => {
    return dataSources?.find((i: any) => i.rowId === node.iTechControlTableRowId);
  };

  const _onClick = (e: any, node: any, select: boolean) => {
    const parent = tree.find((t) => t.guid === node.guid);

    if (select) {
      // stop expand / select when clicking label
      e?.preventDefault();

      onClickSelect?.(node);
    }

    if (!parent || parent.childNodes?.length > 0 || parent.end) return;

    return _getData(node).then((result) => {
      node.loaded = true;
      if (!result.results) {
        return;
      }
      const nodes = result.results;
      const keyTypes = _getTable(node).subItems;
      const childNodes: any = [];
      const keyTypeIndex = parent.keyTypeIndex + 1;
      if (!nodes) return;

      nodes.forEach((n: any) =>
        _mapNode(n, keyTypeIndex, keyTypeIndex >= keyTypes.length, childNodes)
      );
      parent.childNodes = nodes;
      setTree((t) => [...t, ...nodes, ...childNodes]);
    });
  };

  const _mapNode = (n: any, keyTypeIndex: any, end: any, childNodes: any) => {
    n.keyTypeIndex = keyTypeIndex;
    n.end = end && n.childNodes.length === 0;
    childNodes.push(...n.childNodes);
    n.childNodes.map((c: any) => _mapNode(c, keyTypeIndex, end, childNodes));
  };

  const _loadTree = () => {
    roots.forEach((root: any) =>
      _getData(root).then((result) => {
        if (!isMounted()) return;

        result.results.forEach((n: any) => (n.keyTypeIndex = root.keyTypeIndex + 1));
        root.childNodes = result.results;
        const keyTypes = _getTable(root).subItems;
        const childNodes: any = [];
        const keyTypeIndex = root.keyTypeIndex + 1;
        root.childNodes.map((n: any) =>
          _mapNode(n, keyTypeIndex, keyTypeIndex >= keyTypes.length, childNodes)
        );
        setTree((t) => [root, ...t, ...result.results, ...childNodes]);
      })
    );
  };

  useEffect(() => {
    on(RefreshTableEvent, _loadTree);

    setTree([]);
    _loadTree();

    return () => {
      off(RefreshTableEvent, _loadTree);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const EmptyTreeItem = ({ guid, label }: { guid: any; label: string }) => {
    const item = <StyledTreeItem nodeId={`${guid}-end`} label={label} />;
    return item;
  };

  const _renderNode = (node: any) => {
    return (
      !!node && (
        <StyledTreeItem
          nodeId={node.guid ?? "0"}
          label={labelRender ? labelRender(node) : node.name}
          onLabelClick={(e: any) => _onClick(e, node, true)}
          onIconClick={(e: any) => _onClick(e, node, false)}
          key={node.guid}
          className={classes.treeNode}
        >
          {!node.end && _renderChildren(node)}
        </StyledTreeItem>
      )
    );
  };

  const _renderChildren = (node: any) => {
    return !!node && node.childNodes?.length > 0 ? (
      node.childNodes.map(_renderNode)
    ) : (
      <EmptyTreeItem guid={node.guid} label={node.loaded ? "no data" : "loading..."} />
    );
  };

  return (
    <>
      <div className={classes.root}>
        <Box p={1}>
          {tree
            .filter((t) => t.type === "Root")
            .sort((a, b) => a.name.localeCompare(b.name))
            ?.map((root, i) => (
              <TreeView
                className={classes.tree}
                defaultExpanded={[root.guid]}
                defaultCollapseIcon={<MinusSquare />}
                defaultExpandIcon={<PlusSquare />}
                defaultEndIcon={<CloseSquare />}
                key={`${i}-${root.guid}` ?? "0"}
              >
                {_renderNode(root)}
              </TreeView>
            ))}
        </Box>
      </div>
    </>
  );
};

export { TreeDisplayRoot, TreeDisplay };
