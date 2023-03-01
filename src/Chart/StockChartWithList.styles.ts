import makeStyles from '@mui/styles/makeStyles';

// styles for popup on point click in stock chart
export const chartStyles = makeStyles((theme) => ({
  popup: {
    position: "absolute",
    display: "inline-block",
    cursor: "pointer",
    zIndex: 10,
  },
  popuptext: {
    transform: "translate(3%, -25%)",
    visibility: "hidden",
    width: 600,
    height: 350,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.primary.contrastText,
    textAlign: "center",
    borderRadius: 6,
    padding: "8px 0",
    position: "absolute",
    zIndex: 1,
    borderColor: theme.palette.primary.main,
    borderStyle: "solid",
    borderWidth: 1,
  },
  show: {
    visibility: "visible",
    animation: "$fadeIn 1s",
  },
  "@keyframes fadeIn": {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  chartGrid:{
    backgroundColor:theme.palette.background.paper,
    width:'100%',
    height:'100%'
  }
}));
