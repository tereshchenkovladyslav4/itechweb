import React, { useState, ReactElement } from "react";
import { MenuAction } from "../Menu/MenuFunction";
import { TinyButton } from "../_components/TinyButton";
// import 'tippy.js/themes/material.css'; // optional
import "./ItemMenu.css";
import "tippy.js/animations/scale.css";
import { Options } from "@popperjs/core";
import { Instance } from "tippy.js";
import { Button, FabProps, Menu, MenuItem, PropTypes, Tooltip } from "@mui/material";
import { LazyTippy } from "../_components/LazyTippy";
import MenuActions from "../Menu/MenuActions";
import IconManager from "../_components/IconManager";

interface ItemMenuProps {
  onClick?(): any;
  gid: string | number;
  color?: PropTypes.Color | undefined;
  actions: MenuAction[] | (() => MenuAction[]);
  appendTo?: "parent" | Element;
  icon?: string;
  isEnabled?: boolean;
  text?: string;
}
export const TableItemMenu = (
  props: ItemMenuProps & Omit<FabProps, "children">
): ReactElement | null => {
  const { actions, onClick, icon = "Input", text, gid, ...rest } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleOpenMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
    onClick?.();
  };

  const handleClose = () => {
    setAnchorEl(null);
    onClick?.();
  };

  // no actions & no default click handler - so don't render
  const getActions = () => {
    if (typeof props.actions === "function") {
      return props.actions();
    }
    return props.actions;
  };

  const menus = getActions()
    .filter((x) => x.onClick)
    .map((action) => {
      const _onClick = () => {
        setAnchorEl(null);
        if (action.onClick) action.onClick();
      };
      return (
        <MenuItem disabled={action.fixed} key={action.name} onClick={_onClick}>
          {action.icon}
          {action.name}
        </MenuItem>
      );
    });

  return (
    <>
      <Button
        variant="contained"
        color={menus.length === 0 ? "secondary" : "primary"}
        onClick={handleOpenMenu}
        startIcon={<IconManager icon={icon} />}
      >
        {text}
      </Button>
      {menus.length > 0 && (
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={!!anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          {menus}
        </Menu>
      )}
    </>
  );
};

const ItemMenu = (props: ItemMenuProps & Omit<FabProps, "children">): ReactElement | null => {
  const {
    gid,
    color,
    actions,
    onClick,
    appendTo = "parent",
    icon = "Input",
    isEnabled = true,
    ...rest
  } = props;
  const options = appendTo !== "parent" ? undefined : ({ strategy: "fixed" } as Partial<Options>);
  const [instance, setInstance] = useState<Instance>();

  // hide the tippy instance once an action clicked in content
  const hide = () => {
    instance?.hide();
  };

  // no actions & no default click handler - so don't render
  const getActions = () => {
    if (typeof props.actions === "function") {
      return props.actions();
    }
    return props.actions;
  };

  if (getActions().length === 0 && onClick === undefined) return null;

  return (
    <LazyTippy
      interactive={true}
      placement="left"
      disabled={!isEnabled}
      popperOptions={options}
      appendTo={appendTo}
      delay={[500, 0]}
      animation="scale"
      hideOnClick={"toggle"}
      // hideOnClick={true} // this only seems to apply to the child elements not content
      onCreate={(i) => setInstance(i)}
      content={<MenuActions actions={actions} gid={gid} onClick={hide} display="col" />}
    >
      <span>
        <TinyButton icon={icon} onClick={onClick} color={color} disabled={!isEnabled} {...rest} />
      </span>
    </LazyTippy>
  );
};

export default ItemMenu;
