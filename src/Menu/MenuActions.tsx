import React, { forwardRef, useState } from "react";
import MenuFunction, { MenuAction } from "./MenuFunction";
import { useStyles } from "./MenuActions.styles";

interface MenuActionsProps {
  onClick?(e?:any): void;
  gid: string | number;
  actions: MenuAction[] | (() => MenuAction[]);
  isDragging?: boolean;
  display:"row"|"col";
}

const MenuActions = forwardRef<HTMLDivElement, MenuActionsProps>(
  (props, ref) => {
    const classes = useStyles();
    // const [hideTooltips, setHideTooltips] = useState(true);

    const getActions = () => {
      if (typeof props.actions === "function") {
        return props.actions();
      }
      return props.actions;
    };

    return (
      <span ref={ref} className={props.display === "col" ? classes.menuContainerCol : classes.menuContainerRow}>
        {getActions().map((action: any) => (
          <MenuFunction
            action={action}
            key={action.name + props.gid}
            isDragging={props.isDragging || false}
            // hideTooltips={false}
            // setHideTooltips={setHideTooltips}
            onClick={props.onClick}
          />
        ))}
      </span>
    );
  }
);

export default MenuActions;
