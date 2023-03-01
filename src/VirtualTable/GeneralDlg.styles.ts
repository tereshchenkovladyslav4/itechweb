import { alpha } from "@mui/material/styles";

import makeStyles from "@mui/styles/makeStyles";

export const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  header: {
    margin: "20px 30px",
  },
  accordion: {
    marginTop: 10,
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
    justifyContent: "space-evenly",
    flexDirection: "row",
    alignItems: "center",
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
    "& .MuiFormControl-root": {
      margin: "10px 0",
    },
  },
  contrastText: {
    color: theme.palette.primary.contrastText,
    "& .MuiTypography-colorTextSecondary": {
      color: alpha(theme.palette.primary.contrastText, 0.8),
    },
  },
  displayArea: {
    border: "1px solid #CCC",
    padding: "5px 10px 0 10px",
    borderRadius: 5,
    marginBottom: "10px!important",
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
    width: "80%",
  },
  textField: {
    width: "80%",
    margin: "10px 0",
  },
  workflow: {
    marginTop: 8,
  },
  label: {
    margin: "10px 0",
  },
  autocompleteButton: {
    marginTop: 10,
  },
  disabled: {
    color: theme.palette.warning.main,
    "& .MuiSvgIcon-root": {
      color: theme.palette.warning.main,
    },
  },
  archived: {
    backgroundColor: theme.palette.warning.light,
    border: "1px solid",
    borderColor: theme.palette.warning.dark,
  },
  active: {
    backgroundColor: theme.palette.background.component,
  },
  identifier: {
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
    width: "fit-content",
  },
  idInner: {
    display: "flex",
    alignItems: "center",
    marginLeft: 5,
    "& .MuiButtonBase-root": {
      marginLeft: 8,
    },
  },
}));
