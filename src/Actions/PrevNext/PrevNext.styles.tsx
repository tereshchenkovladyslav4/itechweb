import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles(() => ({
  button: {
    height: "100%",
    width: "100%",
    fontSize: 20,
    textAlign: "center",
    // background: theme.palette.primary.main,
    // color: theme.palette.primary.contrastText,
  },
  buttonRow: {
    display: "flex",
    justifyContent: "stretch",
    flexGrow: 1,
    gap: "10px",
  },
}));
