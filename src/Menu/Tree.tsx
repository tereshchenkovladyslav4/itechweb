import React, { useEffect, useState } from "react";
import { Instance } from "tippy.js";
import { Typography } from "@mui/material";
import { TreeNode } from "./TreeNode";
import { MenuAction } from "./MenuFunction";
import { useStyles } from "./MenuTree.styles";
import { TreeView } from "@mui/lab";
import Tippy from "@tippyjs/react";
import StyledTreeItem from "../Tree/StyledTreeItem";
import MenuActions from "./MenuActions";
import IconManager from "../_components/IconManager";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

interface ITreeProps {
  nodes: TreeNode[];
  getNodeActions: (node: TreeNode) => MenuAction[];
  onNodeClick: (node: TreeNode, e?: any) => void;
  selectedNodeId?: number;
  defaultExpanded?: string[];
}

const Tree: React.FC<ITreeProps> = ({
  nodes,
  onNodeClick,
  getNodeActions,
  selectedNodeId,
  defaultExpanded = ["-1"],
}) => {
  const [instance, setInstance] = useState<Instance>();
  const [expanded, setExpanded] = React.useState<string[]>(defaultExpanded);
  const classes = useStyles();

  useEffect(() => {
    setExpanded((prev) => [...new Set([...prev, ...defaultExpanded])]);
  }, [defaultExpanded]);

  const hide = (e: any) => {
    // stop action on underlying element if overlap
    e?.stopPropagation();
    instance?.hide();
  };

  const _renderNode = (node: any) => {
    if (!node) return null;

    // actions per node type
    const actions = getNodeActions(node);

    return (
      <StyledTreeItem
        nodeId={String(node.id)}
        color="secondary"
        label={
          <div className={classes.labelRoot}>
            <Tippy
              interactive={true}
              placement="right"
              offset={[0, -30]}
              appendTo={document.body}
              delay={[500, 0]}
              animation="scale"
              hideOnClick={"toggle"}
              onCreate={(i) => setInstance(i)}
              content={
                <MenuActions
                  actions={
                    node.isOwner && node.type
                      ? !node.fixed
                        ? actions
                        : actions.slice(1) // Skip delete for fixed items N.B. assumes delete at index 0
                      : []
                  }
                  gid={node.rowId}
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
                <Typography
                  variant="body1"
                  className={classes.labelText}
                  style={{ color: node.color }}
                >
                  {node.name}
                </Typography>
              </div>
            </Tippy>
          </div>
        }
        key={node.id}
        onLabelClick={(e: any) => onNodeClick(node, e)}
      >
        {node.children && _renderChildren(node)}
      </StyledTreeItem>
    );
  };

  const _renderChildren = (node: TreeNode) => {
    return node && node.children && node.children?.length > 0
      ? node.children.map((x: any) => _renderNode(x))
      : null;
  };
  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleToggle = (event: React.ChangeEvent<{}>, nodeIds: string[]) => {
    setExpanded(nodeIds);
  };
  return (
    <div>
      <TreeView
        className={classes.root}
        color="secondary"
        expanded={expanded}
        defaultCollapseIcon={<KeyboardArrowDown />}
        defaultExpandIcon={<KeyboardArrowRight />}
        selected={`${selectedNodeId}`}
        onNodeToggle={handleToggle}
        onClick={(e: any) => {
          e.stopPropagation(); // to stop closing of sidebar..
        }}
      >
        {nodes.map((n) => _renderNode(n))}
      </TreeView>
    </div>
  );
};

Tree.displayName = "Tree";
export default Tree;
