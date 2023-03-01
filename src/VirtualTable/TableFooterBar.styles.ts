import makeStyles from "@mui/styles/makeStyles";

export const useStyles = makeStyles((theme) => ({
  tableFooter: {
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    height: "45px",
    position: "fixed",
    "& .MuiTextField-root": {
      marginLeft: "10px",
      marginTop: "9px",
    },
    bottom: 3,
  },
  resultsText: {
    display: "flex",
    padding: theme.spacing(1),
    alignItems: "center",
  },
  tableIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // borderColor: theme.palette.background.paper,
    // border: "1px solid",
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    borderRadius: 5,
    height: 15,
    "& span": {
      margin: "5px 5px 0 0",
    },
    ...theme.typography, // not sure why this isn't being picked up by default?
  },
  loadingBtn: {
    margin: 14,
  },
}));
