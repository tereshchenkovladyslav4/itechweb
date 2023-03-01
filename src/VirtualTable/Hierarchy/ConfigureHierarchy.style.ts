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
  display: {
    margin: "4vh",
  },
  formBackBtn: {
    margin: "0 0 24px 0",
  },
  formSection: {
    paddingBottom: 10,
  },
}));
