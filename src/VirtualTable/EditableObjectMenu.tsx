import { PropTypes } from "@mui/material";
import React from "react";
import { MenuAction } from "../Menu/MenuFunction";
import IconManager from "../_components/IconManager";
import ItemMenu from "./ItemMenu";

interface IEditableObjectMenuProps {
  color: PropTypes.Color;
  //open: () => void;
  edit: () => void;
  remove: () => void;
  gid: string;
  menuActions?: MenuAction[];
}

const EditableObjectMenu: React.FC<IEditableObjectMenuProps> = ({
  color,
  //open,
  edit,
  remove,
  gid,
  menuActions,
}) => {
  let actions: MenuAction[] = [
    // {
    //   icon: <IconManager fontSize="small" icon="Input" onClick={() => open()} />,
    //   name: "Open",
    //   id: 2,
    //   toolTipPlacement: "left-end",
    // },
    {
      icon: <IconManager fontSize="small" icon="Edit" onClick={() => edit()} />,
      name: "Edit",
      id: 3,
      toolTipPlacement: "left-end",
    },
    {
      icon: <IconManager fontSize="small" icon="RemoveCircle" onClick={() => remove()} />,
      name: "Remove",
      id: 4,
      toolTipPlacement: "left-end",
    },
  ];

  if (menuActions != undefined) actions = [...menuActions, ...actions];

  return <ItemMenu actions={actions} gid={gid} onClick={() => edit()} color={color} />;
};

export default EditableObjectMenu;
