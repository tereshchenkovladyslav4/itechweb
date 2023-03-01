import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles((theme) => ({
  component: {
    height: "calc(100% - 34px)", // subtract height of button list
  },
  icon: {
    float: "right",
    transform: "scale(2)",
    marginTop: "15px",
    marginRight: "18px",
  },
  header: {
    padding: "8px 16px",
  },
  tableRow: {
    height: 30,
  },
  tableCell: {
    padding: "0px 16px",
  },
  chipList: {
    padding: "8px 16px",
    "& div": {
      marginRight: "4px",
      marginTop: "4px",
    },
  },
  profileContainer: {
    display: "flex",
    flexDirection: "row",
  },
  avatarIcon: {
    width: "150px!important",
    height: "150px!important",
    margin: 10,
  },
  highlight: {
    color: theme.palette.primary.main,
  },
  column: {
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    margin: 10,
    width: "fit-content",
    "& h5": {
      marginBottom: 10,
    },
  },
}));
