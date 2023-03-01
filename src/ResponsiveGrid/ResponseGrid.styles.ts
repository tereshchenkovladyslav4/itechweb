import { emphasize, alpha } from "@mui/material";

import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles((theme) => ({
  fab: {
    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.background.paper,
    position: "absolute",
    bottom: 10,
    zIndex: 4,
    "&:hover": {
      backgroundColor: emphasize(theme.palette.primary.main, 0.15),
    },
  },
  menuButton: {
    cursor: "pointer",
    "&:hover": {
      color: theme.palette.background.paper,
    },
  },
  componentDisplay: {
    overflow: "auto",
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${alpha(theme.palette.background.menu, 0.3)}`, // same as menu.content background
    "&:hover": {
      boxShadow: theme.shadows[15],
      border: `1px solid ${theme.palette.secondary.main}`,
      transform: "scaleY(1)",
    },
  },
  gridContainer: {
    position: "absolute",
    top: 0,
    /* transition: all 0.3s ease-out; */
    transform: "translateY(0)",
    height: "100%",
    width: "100%",
    overflowX: "auto",
  },
  mainGrid: {
    maxHeight: "calc(100vh - 48px)",
    overflowY: "auto",
    overflowX: "hidden",
  },
  menuColor: {
    // width: "100%",
    backgroundColor: theme.palette.background.menu,
    color: theme.palette.primary.light,
    "& span:hover > svg": {
      color: theme.palette.button.main,
    },
    // top: 0,
    // overflow: "hidden",
    // transition: "all 0.3s ease-out",
    // maxHeight: "27px",
    // height: "auto",
    // transformOrigin: top,
    // transform: "scaleY(0)",
    // opacity: 0,
    // display: "flex",
    // flexDirection: "row-reverse",
    // // cursor: "move", /* fallback if grab cursor is unsupported */
    // cursor: "grab",
    // // cursor: "-moz-grab",
    // // cursor: "-webkit-grab",
    // zIndex: 1,
    // position: "fixed",
  },
  shadowFade: {
    transition: "box-shadow 0.5s ease-in-out",
  },
  colorDropdown: {
    height: 28,
    width: 28,
    padding: 0,
    "& .MuiSelect-select": {
      padding: "0 !important",
    },
  },
  refreshDropdown: {
    height: 28,
    width: 28,
    padding: 0,
    "& .MuiSelect-select": {
      padding: "0 !important",
    },
  }
}));
