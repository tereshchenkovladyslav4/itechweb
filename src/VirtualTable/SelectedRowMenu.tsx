import { PropTypes } from "@mui/material";
import React from "react";
import { MenuAction } from "../Menu/MenuFunction";
import { hasPreviewOrProperties } from "../_helpers/fileActions";
import ItemMenu from "./ItemMenu";

interface ISelectedRowMenuProps {
  gid: string;
  actions: MenuAction[];
  color: PropTypes.Color;
  defaultAction(gid: string): void;
  filterGroupColor?:string;
}

const SelectedRowMenu: React.FC<ISelectedRowMenuProps> = ({
  gid,
  actions,
  color,
  defaultAction,
  filterGroupColor,
}) => {
  // N.B. Assumption is that the first item is "open" and is removed when no preview present on screen
  const getActions = (): MenuAction[] => {
    if (hasPreviewOrProperties(filterGroupColor)) {
      return actions;
    }
    return actions.slice(1);
  };

  return (
    <ItemMenu
      actions={() => getActions()}
      gid={gid}
      onClick={() => defaultAction(gid)}
      color={color}
    />
  );
};

export default SelectedRowMenu;
