import React from "react";
import { alpha } from "@mui/material/styles";
import withStyles from "@mui/styles/withStyles";
import TreeItem, { TreeItemContentProps, TreeItemProps, useTreeItem } from "@mui/lab/TreeItem";
import Collapse, { CollapseProps } from "@mui/material/Collapse";
import { useSpring, animated } from "react-spring/web.cjs"; // web.cjs is required for IE 11 support
import clsx from "clsx";
import { Typography } from "@mui/material";

interface IStyledTreeItemProps {
  onLabelClick?: (e: any) => void;
  onIconClick?: (e: any) => void;
}

const CustomContent = React.forwardRef(function CustomContent(
  props: TreeItemContentProps & IStyledTreeItemProps,
  ref
) {
  const {
    classes,
    className,
    label,
    nodeId,
    icon: iconProp,
    expansionIcon,
    displayIcon,
    onLabelClick,
    onIconClick,
  } = props;

  const {
    disabled,
    expanded,
    selected,
    focused,
    handleExpansion,
    handleSelection,
    preventSelection,
  } = useTreeItem(nodeId);

  const icon = iconProp || expansionIcon || displayIcon;

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    preventSelection(event);
  };

  const handleExpansionClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (onIconClick) {
      onIconClick(event);
    }
    handleExpansion(event);
  };

  const handleSelectionClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (onLabelClick) {
      onLabelClick(event);
    }
    handleSelection(event);
  };

  return (
    <div
      className={clsx(className, classes.root, {
        [classes.expanded]: expanded,
        [classes.selected]: selected,
        [classes.focused]: focused,
        [classes.disabled]: disabled,
      })}
      onMouseDown={handleMouseDown}
      ref={ref as React.Ref<HTMLDivElement>}
    >
      <div onClick={handleExpansionClick} className={classes.iconContainer}>
        {icon}
      </div>
      <Typography onClick={handleSelectionClick} component="div" className={classes.label}>
        {label}
      </Typography>
    </div>
  );
});

function TransitionComponent(props: CollapseProps) {
  const style = useSpring({
    from: { opacity: 0, transform: "translate3d(20px,0,0)" },
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

const StyledTreeItem = withStyles((theme) => ({
  iconContainer: {
    "& .close": {
      //opacity: 0.3,
    },
  },
  group: {
    marginLeft: 7,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.secondary.contrastText, 0.4)}`,
  },
  label: {
    "& div": {
      padding: 0,
      "& div": {
        margin: 4,
      },
    },
  },
  "& .MuiTreeItem-content": {
    width: "unset",
  },
}))((props: IStyledTreeItemProps & TreeItemProps) => {
  const { onLabelClick, onIconClick, ...rest } = props;
  return (
    <TreeItem
      {...rest}
      TransitionComponent={TransitionComponent}
      ContentComponent={CustomContent}
      ContentProps={{ onLabelClick: onLabelClick, onIconClick: onIconClick } as any}
    />
  );
});

export default StyledTreeItem;
