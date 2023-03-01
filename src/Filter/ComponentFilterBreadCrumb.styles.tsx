import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    listStyle: "none",
    padding: theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
    cursor: "help",
  },
  noFilters: {
    maxHeight: 48,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));
