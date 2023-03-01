import React, { ReactElement } from "react";
import IconButton from "@mui/material/IconButton";
import IconManager from "../_components/IconManager";
import { useStyles } from "./MenuTitle.styles";
import { Logo } from "../_components/Logo";
import { useTheme } from "@mui/material/styles";

type MenuTitleProps = {
  drawerCloseHandler: any;
};

const MenuTitle: React.FC<MenuTitleProps> = ({ drawerCloseHandler }): ReactElement => {
  const classes = useStyles();
  const theme = useTheme();
  return (
    <div className={classes.menuTitle}>
      {theme.direction === "ltr" && <Logo />}
      <IconButton onClick={drawerCloseHandler} className={classes.icon} size="large">
        {theme.direction === "rtl" ? (
          <IconManager icon="ChevronRight" />
        ) : (
          <IconManager icon="ChevronLeft" />
        )}
      </IconButton>
    </div>
  );
};

export default MenuTitle;
