import React from "react";
import withStyles from '@mui/styles/withStyles';
import MuiListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconManager from "../_components/IconManager";

const ListItem = withStyles(
  (theme) => ({
    root: {
      display: "flex",
      flexDirection: "row",
      padding: "0 2px 0 3px",
      "& .MuiListItemIcon-root": {
        minWidth: 30,
      },
      "&$selected": {
        backgroundColor: theme.palette.primary.main,
        color: "white",
        "& .MuiListItemIcon-root": {
          color: "white",
        },
      },
      "&$selected:hover": {
        backgroundColor: theme.palette.primary.main,
        color: "white",
        "& .MuiListItemIcon-root": {
          color: "white",
        },
      },
      "&:hover": {
        backgroundColor: theme.palette.primary.main,
        color: "white",
        "& .MuiListItemIcon-root": {
          color: "white",
        },
      },
    },
    selected: {},
  }),
  { withTheme: true }
)(MuiListItem);

export const ListButton = (props) => {
  const { clickHandler } = props;
  return (
    <ListItem button onClick={() => clickHandler(props)} selected={props.selected}>
      <ListItemIcon>
        <IconManager icon={props.icon} />
      </ListItemIcon>
      <ListItemText primary={props.displayName || props.name} />
    </ListItem>
  );
};
