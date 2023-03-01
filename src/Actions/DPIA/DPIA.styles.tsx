import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles((theme) => ({
  button: {
    height: "100%",
    width: "100%",
    fontSize: 20,
    textAlign: "center",
    marginBottom: "5px",
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  header: {
    fontWeight: "bold",
    backgroundColor: theme.palette.secondary.light,
    padding: theme.spacing(1),
  },
  subHeader: {
    fontWeight: "bold",
    backgroundColor: theme.palette.primary.light,
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  section: {
    fontWeight: "bold",
    margin: "5px 0",
    fontSize: "1em",
  },
  textField: {
    marginTop: 4,
  },
  error: {
    color: "Red",
  },
  formGroup: {
    margin: "10px 0",
  },
  helper: {
    margin: "5px 0",
  },
  formLabel: {
    fontWeight: "bold",
    color: theme.palette.primary.contrastText,
  },
}));
