import { alpha } from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";

export const useStyles = makeStyles((theme) => ({
  "@global": {
    ".MuiTreeItem-label:hover, .Mui-selected:hover > .MuiTreeItem-content": {
      backgroundColor: alpha(theme.palette.background.default, 0.2),
    },
    ".Mui-selected > .MuiTreeItem-content, .Mui-selected > .MuiSvgIcon-root": {
      backgroundColor: alpha(theme.palette.background.default, 0.1),
      color: theme.palette.primary.main,
    },
    ".MuiTreeItem-content": {
      padding: 0,
    },
    ".MuiTreeItem-root.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label:hover, .MuiTreeItem-root.Mui-selected:focus > .MuiTreeItem-content .MuiTreeItem-label, .MuiTreeItem-root.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label":
      {
        backgroundColor: "transparent",
      },
  },
  root: {
    height: 216,
    flexGrow: 1,
    maxWidth: 400,
    color: theme.palette.secondary.contrastText,
  },
  labelRoot: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0.5, 0),
  },
  label: {
    width: "100%",
    display: "flex",
    margin: theme.spacing(1),
  },
  labelIcon: {
    marginRight: theme.spacing(1),
  },
  labelNoIcon: {
    width: 14,
  },
  labelText: {
    fontWeight: "inherit",
    flexGrow: 1,
    marginTop: 4,
  },
  menuContainer: {
    height: 42,
    //display: grid, // If want menu as column replace height with these 2 entries
    // width: 42,
    "& button": {
      transform: "scale(0.8)",
    },
  },
}));
