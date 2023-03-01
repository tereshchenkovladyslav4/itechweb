import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles((theme) => ({
  chartContainer: {
    // height: "100%",
    height: "calc(100% - 48px)", 
    width: "100%",
    paddingTop: 18,
    backgroundColor: theme.palette.background.paper,
  },
  timePeriod: {
    minWidth: 120,
    width: 120,
    position: "absolute",
    zIndex: 3, // above the filterBreadcrumbs if it overlaps
    // left: 10,
    top: 3,
    marginLeft: 5,
  },
  filterBreadcrumbs: {
    position: "absolute",
    zIndex: 2,
    left: -20,
    // left:0,
    margin:'auto',
    right:0,
    top: 0,
    width:'50%',
    textAlign:'center',
    paddingLeft:122, // width of time period drop down
  },
  chart: {
    marginTop: 30,
    height: "100%",
  },
  commsChart: {
    marginTop: 42,
    height: "100%",
  },
}));
