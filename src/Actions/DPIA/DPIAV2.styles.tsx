import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles((theme) => ({
  container: {
    // width:'95%',
    // "& .MuiFormLabel-root, & .MuiContainer-root": {
    "& .MuiFormLabel-root": {
      color: theme.palette.text.primary,
    },
    "& .MuiFormGroup-root": {
      color: theme.palette.text.primary,
    },
  },
  button: {
    height: 40,
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
    color: theme.palette.text.primary,
    padding: theme.spacing(1),
  },
  subHeader: {
    fontWeight: "bold",
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
    marginTop:theme.spacing(1),
  },
  section: {
    fontWeight: "bold",
    fontSize: "1em",
    color: theme.palette.text.primary,
  },
  textField: {
    marginTop: 4,
  },
  dropdown: {
    minWidth: 200,
  },
}));
