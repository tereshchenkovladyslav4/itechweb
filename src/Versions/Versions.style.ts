import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles((theme) => ({
  component: {
    height: "calc(100% - 48px)", // subtract height of button list
    backgroundColor: theme.palette.background.component,
  },
  sHeader: {
    width: "auto",
    background: theme.palette.primary.main,
    padding: "4px 10px",
    fontSize: theme.typography.fontSize,
    fontFamily: theme.typography.fontFamily,
    "& a": {
      color: "#FFF",
    },
  },
  vHeader: {
    width: "auto",
    height: 20,
    background: "#4ab54d",
    padding: "4px 10px",
    fontSize: theme.typography.fontSize,
    fontFamily: theme.typography.fontFamily,
  },
  vSimToFsi: {
    width: "auto",
    padding: "4px 10px",
    fontSize: theme.typography.fontSize,
    fontFamily: theme.typography.fontFamily,
    border: "1px solid #DDD",
    margin: 2,
    position: "relative",
  },
  vContainer: {
    width: "95%",
    height: "93%",
    border: "1px solid #CCC",
    margin: 10,
  },
  vName: {},
  vType: {
    color: "#AAA",
    display: "inline",
    margin: "0 10px",
  },
  vDate: {
    width: "auto",
    color: "#AAA",
    fontSize: theme.typography.fontSize,
    fontFamily: theme.typography.fontFamily,
    fontStyle: "italic",
    marginTop: 3,
  },
  vSelect: {
    right: 5,
    top: 11,
    position: "absolute",
  },
}));
