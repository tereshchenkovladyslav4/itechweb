import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles((theme) => ({
  bold: {
    fontWeight: "bold",
  },
  italic: {
    fontStyle: "italic",
  },
  alert: {
    justifyContent: "center",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.palette.error.main,
  },
}));
