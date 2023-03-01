import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    width: "100%",
    maxHeight: "-webkit-fill-available",
    maxWidth: "-webkit-fill-available",

    "& .ReactVirtualized__Table": {
      display: "inline-block",
      backgroundColor: theme.palette.background.default,
      borderRadius: 2,
      position: "fixed",
      marginTop: "45px",
    },

    "& .ReactVirtualized__Table__headerRow": {
      /* overflow: visible!important; */
      // paddingTop: "4px",
      // paddingBottom: "7px",
      paddingRight: "0 !important",
      background: theme.palette.background.default,
      borderBottom: "1px solid " + theme.palette.secondary.light,
    },

    "& .ReactVirtualized__Table__headerColumn:not(:last-child)": {
      borderRight: "1px solid " + theme.palette.secondary.light,
    },

    "& .ReactVirtualized__Table__headerColumn": {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignContent: "center",
      flexWrap: "wrap",
      position: "relative",
      color: theme.palette.primary.contrastText,
      height: "100%",
      "& .input": {
        border: "1px solid #0a5092",
      },
      "& .MuiButtonBase-root": {
        paddingLeft: 3,
      },
      "&:hover": {
        backgroundColor: theme.palette.secondary.light,
        "& h6, .ReactVirtualized__Table__sortableHeaderIcon": {
          color: theme.palette.primary.main,
        },
      },
    },

    "& .ReactVirtualized__Table__headerColumn > h6": {
      textTransform: "none",
      flex: "1 0 50%",
      cursor: "pointer",
      maxHeight: 22,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      marginLeft: 10,
    },

    "& .ReactVirtualized__Table__headerColumn, .ReactVirtualized__Table__rowColumn": {
      margin: 0,
    },

    "& .ReactVirtualized__Table__row": {
      cursor: "pointer",
      "&:hover": {
        backgroundColor: theme.palette.background.paper + "!important", //"#e1f5fe",
      },
    },

    "& .ReactVirtualized__Table__row:nth-child(even)": {
      backgroundColor: theme.palette.button?.light, //"#e1f5fe",
    },

    "& .ReactVirtualized__Table__rowColumn": {
      whiteSpace: "nowrap",
      fontSize: theme.typography.body2.fontSize,
      fontFamily: theme.typography.fontFamily,
      paddingLeft: 1,
    },

    "& .ReactVirtualized__Table__headerFilter": {
      flex: "1 0 50%",
      width: "100%",
    },

    "& .ReactVirtualized__Table__sortableHeaderIcon": {
      position: "absolute",
      right: 15,
      top: 12,
    },

    "& .ReactVirtualized__Table__headerColumn:first-of-type": {
      marginLeft: "0 !important",
    },

    "& .ReactVirtualized__Table__rowColumn:first-of-type": {
      marginLeft: 3,
    },

    "& .ReactVirtualized__Table .MuiTouchRipple-root": {
      left: "-5px !important",
    },

    "& .GridHeader": {
      flex: "auto",
    },

    "& .DragHandle": {
      flex: "0 0 16px",
      zIndex: "2",
      cursor: "col-resize",
      color: theme.palette.secondary.main,
      fontSize: "12px",
      transform: "none !important",
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        color: theme.palette.primary.main,
      },
    },

    "& .DragHandleIcon": {
      flex: "0 0 12px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      transform: "none !important",
    },

    "& .DragHandleActive": {
      "&:hover": {
        color: theme.palette.primary.main,
        zIndex: "3",
        transform: "none !important",
      },
    },
  },
  itemMenu: {
    width: 33,
    height: 33,
    marginRight: 10,
  },
  backToChart: {
    marginRight: 5,
  },
}));
