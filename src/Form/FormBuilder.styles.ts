import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles((theme) => ({
  root: {
    padding: "0px",
    height: "100%",
    width: "100%",
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 1202,
    display: "none",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    transition: "background-color 1s linear",
  },
  formContainer: {
    position: "relative",
    width: "50vw",
    minHeight: "40px",
    maxHeight: "95%",
    left: "25%",
    backgroundColor: theme.palette.background.paper, //"#EEEEEE",
    // boxShadow: "4px 4px 4px #888888",
    boxShadow: theme.shadows[10],
    animationDuration: "700ms",
    transformOrigin: "bottom",
    alignSelf: "baseline",
    display: "none",
    overflowX: "auto",
  },
  closeButton: {
    top: "3px",
    right: "3px",
    position: "absolute",
  },
}));
