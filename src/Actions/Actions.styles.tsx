import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles((theme) => ({
  button: {
    height: "100%",
    width: "100%",
    fontSize: 20,
    textAlign: "center",
    // background: theme.palette.primary.main,
    // color: theme.palette.primary.contrastText,
  },
  containerTall: {
    marginBottom: 10,
  },
  actionBox: {
    border: "1px solid #CCC",
    borderRadius: "4px",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "stretch",
    flexGrow: 1,
    gap: "10px",
  },
  checkbox: {
    marginLeft: 5,
  },
  textbox: {
    fontFamily: theme.typography.fontFamily,
  },
  container: {
    backgroundColor: theme.palette.background.paper,
  },
}));
