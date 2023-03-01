import { alpha, Theme } from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";

export interface StyleProps {
  width: number;
}

//const drawerWidth = 270;
const menuShadow = "0px 2px 8px rgba(65,64,66, 0.5)";
const tabShadow = "0px 2px 4px rgba(188,190,192, 0.297628)";

export const useStyles = makeStyles<Theme, StyleProps>(
  (theme) => ({
    root: {
      display: "flex",
    },
    draggable: {
      "&:hover": {
        backgroundColor: theme.palette.warning.main,
      },
      width: 5,
      height: "100vh",
      position: "absolute",
      cursor: "col-resize",
      zIndex: 99,
      transform: "none",
    },
    closed: {
      backgroundColor: theme.palette.warning.light,
      color: theme.palette.warning.contrastText,
    },
    content: {
      // main body of page
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
      height: "100vh",
      // padding: theme.spacing(1),
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      height: 50,
      boxShadow: tabShadow,
    },
    appBarShift: {
      marginLeft: ({ width }) => width,
      width: ({ width }) => `calc(100% - ${width}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 30,
      marginLeft: -20,
      color: theme.palette.button.main,
    },
    hide: {
      display: "none",
    },
    drawer: {
      width: ({ width }) => width,
      flexShrink: 0,
      whiteSpace: "nowrap",
    },
    drawerOpen: {
      overflow: "visible",
      width: ({ width }) => width,
      backgroundColor: theme.palette.background.menu,
      boxShadow: menuShadow,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: "hidden",
      backgroundColor: theme.palette.background.menu,
      boxShadow: menuShadow,
      width: ({ width }) => width,
      // width: theme.spacing(6) + 4,
      // [theme.breakpoints.up("sm")]: {
      //   width: theme.spacing(6) + 4,
      // },
      color: theme.palette.secondary.contrastText,
    },
    menuTitle: {
      display: "flex",
      alignItems: "center",
      justifyContent: "right",
      padding: theme.spacing(0, 1),
      minHeight: 50, // should be same value as top tab bar
      //minHeight: (props: MenuStyleProps) => props.height,
      // necessary for content to be below app bar
      //...theme.mixins.toolbar,
    },
    toolBar: {
      //minHeight: (props: MenuStyleProps) => props.height,
      flexGrow: 1,
      minHeight: 50,
    },
    menuTree: {
      height: "calc(100% - 150px)", // subtract height of other items (top menu logo 48px + spacers 2px  +  user icon display 45px ) -- removed + add page button 45px
      overflowY: "auto",
      overflowX: "auto",
    },
    casesTree: {
      height: "95%",
      overflowY: "auto",
      overflowX: "hidden",
    },
    menuList: {
      "& .MuiListItemIcon-root": {
        color: theme.palette.secondary.contrastText,
      },
      "& .MuiListItem-root:hover": {
        "& .MuiListItemIcon-root": {
          color: theme.palette.primary.main,
        },
        backgroundColor: alpha(theme.palette.secondary.light, 0.1),
      },
    },
  }),
  { index: 1 }
);

export const menuItemStyles = makeStyles((theme) => ({
  // "@global": {
  //   "& .MuiSvgIcon-root": {
  //     color: theme.palette.secondary.dark,
  //   },
  // },
  selected: {
    fontWeight: "bold",
    //color: theme.palette.button.main + "!important",
  },
  item: {
    //overflowX: "hidden",
    // "& .MuiListItemIcon-root": {
    //   color: theme.palette.secondary.contrastText,
    // },
    "&:hover": {
      backgroundColor: theme.palette.secondary.light,
    },
    paddingLeft: 12,
  },
}));
