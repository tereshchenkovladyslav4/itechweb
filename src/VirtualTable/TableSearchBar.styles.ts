import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles((theme) => ({
  tableSearchBar: {
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
  },
  tableSearchResults: {
    right: "10px",
    display: "flex",
    "& button": {
      lineHeight: 0.9,
      padding: "4px 10px",
    },
  },
  tableSearchText: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    listStyle: "none",
    padding: theme.spacing(1),
    margin: "auto",
  },
  tableSearchArea: {
    display: "flex",
    marginLeft: "5px",
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
