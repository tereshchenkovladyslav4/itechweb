import { lighten } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";

export const useStyles = makeStyles((theme) => ({
  editor: {
    border: "1px solid",
    borderColor: theme.palette.secondary.light,
    margin: 20,
    borderRadius: 3,
  },
  readOnly: {
    padding: "0 20px",
    backgroundColor: theme.palette.background.default,
  },
  advEditor: {
    width: "calc(100% - 10px)",
    height: "calc(100% - 10px)",
    margin: 5,
  },
  left: {
    paddingLeft: theme.spacing(1),
    paddingRight: 10,
  },
  right: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    color: lighten(theme.palette.secondary.main, 0.5),
  },
  time: {
    marginTop: 5,
    marginRight: 3,
    color: lighten(theme.palette.secondary.main, 0.5),
  },
  username: {
    color: theme.palette.secondary.active,
    margin: "0 10px",
  },
  label: {
    alignItems: "center",
    display: "flex",
    paddingLeft: theme.spacing(1),
    fontSize: theme.typography.fontSize,
  },
  textField: {
    margin: "5px 0",
  },
  simpleTitle: {
    margin: 5,
    fontSize: "1.5em",
  },
  noteIcon: {
    marginTop: "5px",
  },
  expandIcon: {
    marginTop: "15px",
  },
  collapseContent: {
    width: "100%",
  },
  simpleContent: {
    width: "100%",
    "& #mui-rte-root": {
      width: "100%",
      overflow: "unset",
    },
    "& #mui-rte-editor": {
      overflow: "unset",
    },
  },
  advancedContent: {
    width: "100%",
    "& #mui-rte-root": {
      width: "100%",
      overflow: "unset",
    },
    "& #mui-rte-editor": {
      overflow: "unset",
    },
  },
  muiEdtableContainer: {
    height: "100%",
    minHeight: 128,
  },
  muiContainer: {
    height: "100%",
  },
  muiEditorContainer: {
    margin: "10px 0 0 0",
    padding: 0,
    minHeight: 60,
  },
  muiEditorPlaceholder: {
    top: 42,
    position: "absolute",
  },
  btn: {
    lineHeight: "0.9",
    margin: "10px 10px 5px 10px",
  },
  toolbar: {
    margin: "0 10px",
    padding: "10px 0",
    borderBottom: "1px solid",
    borderColor: theme.palette.secondary.main,
    "& .MuiIconButton-sizeSmall": {
      "& .MuiSvgIcon-fontSizeMedium": {
        fontSize: "1.2rem",
      },
    },
  },
  hiddenButtonContainer: {
    "& .hidden-button": {
      opacity: 0,
      transform: "translateX(20px)",
      transition: "0.5s",
    },
    "&:hover .hidden-button": {
      opacity: 1,
      transform: "translateX(0)",
    },
  },
  submitContainer: {
    width: "100%",
    borderTop: "1px solid",
    borderColor: theme.palette.secondary.light,
  },
  userIcon: {
    width: 46,
    "& .MuiSvgIcon-root": {
      marginLeft: 6,
      height: 45,
      width: 45,
    },
  },
  user: {
    color: theme.palette.secondary.active,
  },
  reply:{
    marginLeft:20,
  },
}));
