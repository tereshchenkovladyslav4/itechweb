import React, { ReactElement } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import IconManager from "../_components/IconManager";
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(() => ({
  listButton: {
    padding: "0 16px",
  },
}));

type StaticMenuItemProps = {
  name: any;
  onclick: any;
  showTooltipTitle: any;
  icon: any;
};

const StaticMenuItem: React.FC<StaticMenuItemProps> = ({
  name,
  onclick,
  showTooltipTitle,
  icon,
}): ReactElement => {
  const classes = useStyles();
  return (
    <ListItem
      button
      key={name}
      onClick={onclick}
      className={classes.listButton}
    >
      <Tooltip title={showTooltipTitle ? name : ""} placement="right">
        <ListItemIcon>
          <IconManager icon={icon} />
        </ListItemIcon>
      </Tooltip>
      <ListItemText primary={name} />
    </ListItem>
  );
};

export default StaticMenuItem;
