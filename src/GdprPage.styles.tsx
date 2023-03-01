import makeStyles from "@mui/styles/makeStyles";

export const useStyles = makeStyles((theme) => ({
  gdprForm: {
    overflowY: "auto",
    height: "100vh",
    backgroundColor: theme.palette.background.menu,
    "& .MuiTypography-h1, .MuiTypography-body2": {
      color: theme.palette.secondary.contrastText,
    },
    "& .MuiAlert-root": {
      marginBottom: 5,
    },
  },
  box: {
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.primary.contrastText,
    padding: 25,
    marginBottom: 30,
    "& .MuiTypography-body2, .MuiFormHelperText-root, .MuiFormLabel-root": {
      color: theme.palette.primary.contrastText + "!important",
    },
    "& .MuiTypography-h4": {
      marginBottom: 20,
    },
    "& .MuiIconButton-root svg": {
      width: 50,
      height: 50,
    },
    "& .MuiButton-contained": {
      padding: 25,
    },
    "& .Mui-error": {
      color: theme.palette.primary.main,
    },
  },
  title: {
    margin: theme.spacing(3, 0, 3),
  },
  goBack: {
    margin: theme.spacing(3, 0, 2),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: theme.palette.neutral.main,
  },
  detail: {
    margin: "20px 0",
    fontStyle: "italic",
  },
  response: {
    fontStyle: "italic",
    fontSize: 16,
  },
  error: {
    color: "Red",
  },
  textField: {
    minWidth: 300,
    marginBottom: 10,
    "& .MuiInputBase-multiline": {
      minWidth: 600,
    },
    "& .MuiOutlinedInput-root, .MuiFormLabel-root": {
      padding: "7px 0px",
    },
    "& .MuiOutlinedInput-inputMultiline": {
      padding: "10px 14px",
      minWidth: 450,
    },
    "& .MuiOutlinedInput-root, intput": {
      fontSize: 16,
    },
    "& .MuiFormHelperText-root": {
      fontSize: 12,
      margin: "5px 0",
    },
  },
  bottom: {
    marginBottom: 15,
  },
  date: {
    "& input": {
      textTransform: "uppercase",
    },
  },
  horizontal: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    "& .MuiBox-root": {
      paddingRight: 10,
    },
    "& .MuiButton-contained": {
      marginBottom: 3,
    },
  },
}));
