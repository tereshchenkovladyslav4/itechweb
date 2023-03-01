import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    marginBottom: 20,
    padding: 10,
    borderRadius: 2,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  display: {
    margin: "4vh",
  },
  menuFilterItem: {
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
  textField: {
    "& .Mui-focused legend": {
      paddingRight: 20,
    },
  },
  formSubmitBtn: {
    margin: "0 0 24px 10px",
  },
  formBackBtn: {
    margin: "0 0 24px 0",
  },
  formSection: {
    paddingBottom: "20px",
  },
  formOutlinedButton:{
    color:theme.palette.text.primary,
  }
}));
