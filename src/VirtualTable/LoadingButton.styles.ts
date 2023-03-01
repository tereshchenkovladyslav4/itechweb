import makeStyles from "@mui/styles/makeStyles";
import { green } from "@mui/material/colors";

export const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    color: theme.palette.primary.main,
  },
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },
  buttonSuccess: {
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700],
    },
    opacity: "0",
    transitionDelay: "5s",
    transition: "visibility 0s, opacity 1s linear",
  },
  fabProgress: {
    color: green[500],
    position: "absolute",
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "35%",
    left: "40%",
  },
}));
