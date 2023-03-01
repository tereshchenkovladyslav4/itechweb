import makeStyles from '@mui/styles/makeStyles';
import { darken } from "@mui/material/styles";

export const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    display: "flex",
    height: "100%",
    backgroundColor: theme.palette.background.component,
  },
  innerPadding: {
    margin: 10,
  },
  listDisplay: {
    padding: 0,
  },
  chunk: {
    float: "left",
    flex: "auto",
    minWidth: 120,
    padding: "0 5px",
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
  listItem: {
    padding: "0 0 0 6px",
    "& p": {
      color: theme.palette.primary.contrastText,
    },
  },
  listItemText: {
    ...theme.typography.body1,
    fontWeight: "bold",
  },
  listItemContent: {
    wordBreak: "break-word",
  },
  horizontal: {
    display: "flex",
    flexDirection: "row",
  },
  vertical: {
    display: "flex",
    flexDirection: "column",
  },
  header: {
    "& .MuiTypography-h6": {
      width: 80,
      display: "inline-block",
      height: "100%",
      float: "left",
    },
    "& .MuiTypography-body2": {
      height: "100%",
    },
  },
  column: {
    width: "33%",
    height: "100%",
    "& p": {
      margin: "5px 0",
    },
    wordBreak:'break-word',
  },
  info: {
    padding: 5,
    "& .MuiTypography-h6": {
      fontWeight: "bold",
      color: darken(theme.palette.primary.contrastText, 0.7),
    },
  },
}));
