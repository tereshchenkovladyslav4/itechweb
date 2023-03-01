import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  formControl: {
    maxWidth: 360,
    width: "100%",
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  display: {
    margin: "4vh",
  },
  mnuFilterItem: {
    width: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    height: theme.typography.fontSize + 8, // TODO.. improve this...(lineheight?) just setting height to not show username span when no room
    "& span:nth-of-type(2)": {
      float: "right",
      color: theme.palette.text.secondary,
    },
  },
  button: {
    margin: "10px 10px 10px 0",
  },
  customName: {
    margin: "10px 0",
  },
}));
