import React, { ReactElement, useState } from "react";
import makeStyles from "@mui/styles/makeStyles";
import Fab from "@mui/material/Fab";
import Tooltip from "@mui/material/Tooltip";

const useStyles = makeStyles((theme) => ({
  fab: {
    margin: 2,
    color: theme.palette.button?.light,
    backgroundColor: theme.palette.button?.main,
    "&:hover": {
      backgroundColor: theme.palette.button?.light,
      color: theme.palette.button?.main,
    },
    width: 30,
    height: 30,
    minHeight: 0,
  },
  tooltip: {
    // transform: "none",
  },
}));

export type ToolTipPlacement =
  | "bottom-end"
  | "bottom-start"
  | "bottom"
  | "left-end"
  | "left-start"
  | "left"
  | "right-end"
  | "right-start"
  | "right"
  | "top-end"
  | "top-start"
  | "top";

export interface MenuAction {
  name: string;
  icon: JSX.Element;
  id?: number | string;
  fixed?: boolean;
  toolTipPlacement?: ToolTipPlacement;
  onClick?: () => void;
}

type MenuFunctionProps = {
  action: MenuAction;
  isDragging: boolean;
  // hideTooltips: boolean;
  // setHideTooltips: any;
  onClick?(e?: any): void;
};

const MenuFunction: React.FC<MenuFunctionProps> = ({
  action,
  isDragging,
  // hideTooltips,
  // setHideTooltips,
  onClick,
}): ReactElement => {
  const classes = useStyles();
  const [tooltipIsOpen, setTooltipIsOpen] = useState(false);

  const display = (
    <Tooltip
      key={action.name}
      title={action.name}
      // open={!isDragging && !hideTooltips && tooltipIsOpen}
      open={!isDragging && tooltipIsOpen}
      onOpen={() => setTooltipIsOpen(true)}
      onClose={() => setTooltipIsOpen(false)}
      placement={action.toolTipPlacement}
      className={classes.tooltip}
    >
      <span>
        <Fab
          className={classes.fab}
          tabIndex={Number(action.id)}
          role="menuitem"
          disableRipple={isDragging}
          key={action.name}
          // onMouseEnter={() => setHideTooltips(false)}
          // onMouseLeave={() => setHideTooltips(true)}
          onClick={onClick}
          disabled={action.fixed}
        >
          {action.icon}
        </Fab>
      </span>
    </Tooltip>
  );

  return action.id === 1 ? <span className="draggable">{display}</span> : display;
};

export default MenuFunction;
