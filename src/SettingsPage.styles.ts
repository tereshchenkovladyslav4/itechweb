import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: 4,
    },
    "& .MuiSelect-root": {
      padding: 11,
    },
    "& label, p": {
      color: theme.palette.primary.contrastText,
    },
  },
  paper: {
    padding: 10,
    color: theme.palette.text.secondary,
  },

  heading: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  form: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  submit: {
    display: "flex",
    flexDirection: "column-reverse",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  label: {
    alignItems: "center",
    display: "flex",
    fontSize: theme.typography.fontSize,
  },
  textField: {
    margin: 5,
  },
  select: {
    padding: 0,
  },
  backBtn: {
    marginTop: theme.spacing(2),
  },
}));
