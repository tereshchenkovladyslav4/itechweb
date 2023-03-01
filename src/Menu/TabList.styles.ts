import makeStyles from "@mui/styles/makeStyles";

export const useStyles = makeStyles((theme) => ({
  default: {
    backgroundColor: theme.palette.secondary.contrastText,
  },
  closed: {
    backgroundColor: theme.palette.warning.light,
    color: theme.palette.warning.contrastText,
  },
  buttonContainer: {
    height: 40,
    "&:hover > $miniForm ": {
      opacity: 1,
      marginTop: -7,
    },
  },
  buttonStyle: {
    minWidth: 100,
    margin: "6px 30px 12px 30px",
    "&.Mui-disabled": {
      backgroundColor: theme.palette.secondary.active, // as otherwise black on black background in tab list
    },
  },
  appBarContainer: {
    flexGrow: 1,
    maxWidth:
      "calc(100% - 78px)" /* subtract width of sidepanel icon (30px) & scroll button (48px)( when left drawer minimized ) */,
  },
  miniForm: {
    transition: "all 0.5s ease",
    position: "fixed",
    padding: 10,
    //border: "1px solid #1a0831",
    backgroundColor: theme.palette.background.paper,
    // boxShadow: "4px 4px 4px #888888",
    boxShadow: theme.shadows[10],
    opacity: 0,
    marginTop: -55,
    fontSize: 14,
  },
}));

export const errorStyles = makeStyles((theme) => ({
  error: {
    "&.MuiFormHelperText-root.Mui-error": {
      color: theme.palette.error.main,
      marginTop: 0,
    },
  },
}));

export const tabStyles = makeStyles((theme) => ({
  tab: {
    height: 50,
    fontWeight: 400,
  },
  tabContainer: {
    "&:hover .MuiTab-wrapper, .Mui-selected": {
      color: theme.palette.primary.main,
    },
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
    },
    "&.MuiButtonBase-root MuiTab-root MuiTab-textColorInherit": {
      backgroundColor: "red",
    },
    "& .Mui-selected": {
      fontWeight: 500,
    },
    "&.react-draggable-dragging": {
      opacity: "1!important",
      top: "38px!important",
    },
    "&:hover > .dialHolderdown": {
      opacity: "1!important",
      top: "45px!important",
    },
    "& > .dialHolderdown button": {
      transition: "transform 600ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, opacity 0.8s",
      opacity: 0,
      transform: "scale(0) rotate(-80deg)",
    },
    "& > .dialHolderdown": {
      top: "-64px",
      marginLeft: "50px",
      position: "fixed",
      width: "47px",

      opacity: "0",
      display: "grid",
      transform: "none",
    },
    "&:hover > .dialHolderdown button": {
      opacity: "1 !important",
      transform: "scale(0.8) rotate(0deg) !important",
    },

    /* "&:hover > .dialHolderdown button:nth-child(1)": {
      transitionProperty: "transform",
      transitionDelay: "500ms !important",
    },
    "&:hover > .dialHolderdown button:nth-child(2)": {
      transitionProperty: "transform",
      transitionDelay: "600ms !important",
    },
    "&:hover > .dialHolderdown button:nth-child(3)": {
      transitionProperty: "transform",
      transitionDelay: "700ms !important",
    }, */
    "&.react-draggable-dragging button ": {
      opacity: "1 !important",
      transform: "scale(0.8) rotate(0deg) !important",
    },
  },
}));
