import React, { ReactElement } from "react";
import IconManager from "../_components/IconManager";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import MenuFunction from "./MenuFunction";
import MenuDrag from "./MenuDrag";
import { Link } from "react-router-dom";
import { menuItemStyles } from "./Menu.styles";

type MenuItemProps = {
  item: any;
  menuRef: any;
  elRefs: any;
  //innerRef: any;
  onEdit: any;
  onDelete: any;
  disable: any;
  onSetMenuIndex: any;
  onSetCurrentMenu: any;
  location: any;
  i: number;
};

const MenuItem: React.FC<MenuItemProps> = ({
  item,
  menuRef,
  elRefs,
  //innerRef,
  onEdit,
  onDelete,
  disable,
  onSetMenuIndex,
  onSetCurrentMenu,
  location,
  i,
}): ReactElement => {
  const classes = menuItemStyles();
  const [isDragging, setIsDragging] = React.useState(false);
  // const [hideTooltips, setHideTooltips] = React.useState(true);

  function _editPage(e: any) {
    e.stopPropagation();
    e.preventDefault();
    // setHideTooltips(true);
    onEdit();
  }

  function _deletePage(e: any) {
    e.stopPropagation();
    e.preventDefault();
    // setHideTooltips(true);
    onDelete();
  }

  const actions = [
    {
      icon: <IconManager icon="OpenWith" style={{ cursor: "n-resize" }} />,
      name: "Drag to move",
      id: 1,
    },
    {
      icon: <IconManager icon="Edit" onClick={(e: any) => _editPage(e)} />,
      name: "Edit page",
      id: 2,
    },
    {
      icon: <IconManager icon="Delete" onClick={(e: any) => _deletePage(e)} />,
      name: "Delete",
      id: 3,
    },
  ];

  function _menuSelected() {
    if (location.pathname === "/") return !!item.selected;

    const paths = location.pathname.split("/");
    if (paths.filter((x: string) => x !== "").length > 2) paths.pop(); // remove tab
    return paths.length > 0 ? item.path === paths.join("/") : !!item.selected;
  }
  const tooltipText = !disable ? "" : item.name;

  return (
    <span className="menuContainer">
      {!disable && (
        <MenuDrag
          item={item}
          menuRef={menuRef}
          elRefs={elRefs}
          setIsDragging={setIsDragging}
          // setHideTooltips={setHideTooltips}
          onSetMenuIndex={onSetMenuIndex}
          direction="right"
        >
          {actions.map((action) => (
            <MenuFunction
              action={action}
              key={action.name}
              isDragging={isDragging}
              // hideTooltips={hideTooltips}
              // setHideTooltips={setHideTooltips}
            />
          ))}
        </MenuDrag>
      )}
      <ListItem
        button
        key={item.position}
        selected={_menuSelected()}
        tabIndex={item.position}
        onClick={() => onSetCurrentMenu(item)}
        disableRipple={isDragging}
        component={Link}
        to={item.path}
        ref={(el: any) => {
          elRefs.current[i] = el;
        }}
        className={classes.item}
        color="secondary"
      >
        <Tooltip title={tooltipText} placement="right">
          <ListItemIcon className={_menuSelected() ? classes.selected : undefined}>
            <IconManager icon={item.icon} />
          </ListItemIcon>
        </Tooltip>
        <ListItemText
          primary={item.name}
          classes={{ primary: _menuSelected() ? classes.selected : undefined }}
        />
      </ListItem>
    </span>
  );
};

export default MenuItem;
