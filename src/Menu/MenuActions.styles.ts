import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles((theme) => ({
  root: {
    height: 216,
    flexGrow: 1,
    maxWidth: 400,
  },
  labelRoot: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0.5, 0),
  },
  label: {
    width: "100%",
    display: "flex",
  },
  labelIcon: {
    marginRight: theme.spacing(1),
    color: theme.palette.grey[600],
  },
  labelNoIcon: {
    width: 14,
  },
  labelText: {
    fontWeight: "inherit",
    flexGrow: 1,
  },
  menuContainerRow: {
    height: 42,
    "& button": {
      transform: "scale(0.8)",
    },
  },
  menuContainerCol: {
    display: "grid",
    width: 42,
    // "& button": {
    //   transform: "scale(0.8)",
    // },
  },
}));
