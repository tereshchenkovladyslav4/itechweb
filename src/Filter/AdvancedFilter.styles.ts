import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles((theme) => ({
  formContainer: {
    height: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  formControl: {
    margin: "4px!important",
    minWidth: 150,
    maxWidth: 200,
  },
  closeButton: {
    top: "3px",
    right: "3px",
    position: "absolute",
    zIndex: 1000, // added as seems overlapping value field prevents click on some rendered input types
  },
  loadFilters: {
    marginRight: "auto",
    overflow: "",
    // position: "absolute",
    // left: 0,
  },
  menuFilterItem: {
    width: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    height: theme.typography.fontSize + 8, // TODO.. improve this...(lineheight?) just setting height to not show username span when no room
    "& span:nth-of-type(2)": {
      float: "right",
      marginLeft:theme.spacing(1),
      color: theme.palette.text.disabled, // was secondary but thats now white in glDarkTheme
    },
  },
  accordion: {
    margin: 5,
    "& .Mui-expanded": {
      margin: "6px 0px 1px 0px",
    },
    // backgroundColor:'#f8f8ff',
  },
  expanded: {
    "&$expanded": {
      margin: 5,
    },
  },
  accordionSummary: {
    overflowWrap: "anywhere",
    padding: "0px 6px",
    margin: "6px 0px",
  },
  accordionDetails: {
    flexWrap: "wrap",
    padding: "0 0 0 20px",
  },
  recordCount: {
    marginLeft: 20,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#2196f3",
    borderRadius: 2,
  },
  alert: {
    padding: "0 16px!important",
    "& .MuiAlert-message": {
      padding: "7px 0",
      minWidth: 25,
    },
  },
}));
