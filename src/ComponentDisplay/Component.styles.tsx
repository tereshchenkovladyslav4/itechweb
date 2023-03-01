import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles((theme) => ({
  componentList: {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: theme.palette.background.paper,
   
    "& .MuiTabs-indicator": {
      backgroundColor: theme.palette.primary.main,
    },
  },
  tabs: {
    backgroundColor: theme.palette.background.default,
  },
  arrowButton: {
    display: "flex",
    justifyContent: "space-between",
  },
  component: {
    height: "calc(100% - 48px)", // subtract height of button list
  },
  fontFix: {
    "& *": {
      fontFamily: theme.typography.fontFamily,
    },
  },
  iconButton: {
    padding: 3,
    borderRadius: 0,
  },
}));
