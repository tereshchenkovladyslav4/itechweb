import makeStyles from "@mui/styles/makeStyles";

export const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  header: {
    margin: "20px 30px",
  },
  accordion: {
    backgroundColor: "#EEEEEE",
    marginTop: 10,
  },
  score: {
    width: 80,
  },
  buttonText: {
    width: 40,
    display: "inline-block",
    marginRight: 5,
  },
  expanded: {
    "&$expanded": {
      margin: "0",
    },
  },
  leftPanel: {
    width: "calc(50% - 30px)",
    float: "left",
  },
  rightPanel: {
    width: "calc(50% - 30px)",
    float: "right",
  },
  horizontal: {
    flexWrap: "wrap",
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    "& .MuiFormControl-root": {
      margin: "0 5px",
      "& .MuiInputBase-root": {
        padding: 0,
      },
    },
  },
  vertical: {
    flexWrap: "wrap",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
  },
  caseUsers: {
    overflowY: "auto",
    maxHeight: 339,
    minHeight: 50,
    marginBottom: 10,
  },
  accordionHeading: {
    fontSize: "1em",
  },
  accordionDetails: {
    display: "inherit",
  },
  formButton: {
    margin: "0 0 24px 24px",
  },
  formSection: {
    margin: "5px 30px",
  },
  displayArea: {
    border: "1px solid #CCC",
    padding: "10px",
    borderRadius: 5,
    margin: "10px 0",
  },
  user: {
    borderRadius: 5,
    background: "#DDD",
    padding: 3,
  },
  clear: {
    float: "none",
    clear: "both",
  },
  listItem: {
    paddingLeft: 0,
  },
  name: {
    width: "30%",
  },
  workflow: {
    //marginTop: 8,
  },
  addUser: {
    marginTop: 10,
  },
  disabled: {
    color: theme.palette.warning.main,
    "& .MuiSvgIcon-root": {
      color: theme.palette.warning.main,
    },
  },
}));
