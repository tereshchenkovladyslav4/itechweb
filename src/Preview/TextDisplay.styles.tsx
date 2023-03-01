import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
    margin: "30px 10px",
    backgroundColor: theme.palette.background.component,
  },
  title: {
    fontSize: theme.typography.fontSize,
    color: theme.palette.primary.contrastText,
  },
  unavailable: {
    color: "Red",
    fontStyle: "italic",
  },
  default: {
    whiteSpace: "pre-wrap",
  },
  container: {
    paddingTop: 25,
    backgroundColor: theme.palette.background.paper,
  },
}));
