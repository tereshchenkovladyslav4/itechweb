import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles((theme) => ({
  button: {
    height: "100%",
    width: "100%",
    fontSize: 20,
    textAlign: "center",
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&.Mui-disabled": {
      color: theme.palette.secondary.light,
      opacity: 1,
    },
  },
  containerTall: {
    marginBottom: 10,
  },
  actionBox: {
    border: "1px solid #CCC",
    borderRadius: "4px",
  },
  checkbox: {
    marginLeft: 5,
  },
  approved: {
    backgroundColor: "#d3fffe",
  },
  denied: {
    backgroundColor: "#ffd3d4",
  },
}));
