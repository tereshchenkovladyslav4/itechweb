import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
  },
  header: {
    margin: "20px 30px",
  },
  caseDetails: {
    backgroundColor: "#EEEEEE",
    margin: "10px 20px",
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
    flexDirection: "row",
    maxHeight: 400,
    overflowX: "auto",
  },
  caseUsers: {
    overflowY: "auto",
    maxHeight: 339,
    minHeight: 50,
    marginBottom: 10,
  },
  accordionHeading: {
    margin: "10px 15px",
  },
  formButton: {
    margin: "0 0 24px 24px",
  },
  formSection: {
    margin: "5px 30px",
  },
  displayArea: {
    border: "1px solid #CCC",
    padding: "5px 10px",
    borderRadius: 5,
    marginBottom: "10px!important",
    "& .MuiFormControl-root": {
      margin: "5px 0",
    },
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
  right: {
    margin: "10px 30px",
    float: "right",
    clear: "both",
  },
  date: {
    "& input": {
      textTransform: "uppercase",
    },
  },
}));
