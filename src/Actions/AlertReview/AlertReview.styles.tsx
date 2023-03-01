import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles((theme) => ({
  button: {
    height: "100%",
    width: "100%",
    fontSize: 20,
    textAlign: "center",
    marginBottom: "5px",
    // background: theme.palette.primary.main,
    // color: theme.palette.primary.contrastText,
    "&.Mui-disabled": {
      background: "#888",
      opacity: 1,
    },
  },
  confirmed: {
    backgroundColor: theme.palette.secondary.light,
  },
  denied: {
    backgroundColor: theme.palette.secondary.main, //"#ffd3d4",
    color: theme.palette.secondary.contrastText,
  },
  actionBox: {
    border: "1px solid #CCC",
    borderRadius: "4px",
  },
  containerTall: {
    margin: "10px 0",
  },
}));
