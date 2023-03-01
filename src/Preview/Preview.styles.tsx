import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles((theme) => ({
  downloadBtn: {
    top: 10,
    left: 10,
    padding: "4px 10px",
    float: "left",
    marginBottom: 15,
  },
  root: {
    lineHeight: "0.9",
    position: "absolute",
    top: 10,
    left: 10,
    padding: "4px 10px",
  },
  waiting: {
    height: "calc(100% - 48px)", // subtract height of button list
    backgroundColor: theme.palette.background.component,
  },
  container: {
    backgroundColor: theme.palette.background.component,
  },
}));
