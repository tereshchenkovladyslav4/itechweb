import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  tree: {
    flexGrow: 1,
    maxWidth: 400,
  },
  settings: {
    position: "absolute",
    right: 0,
    zIndex: 2,
  },
  treeNode: {
    color: theme.palette.secondary.main,
    "& .MuiTypography-root": {
      ...theme.typography.body2,
    },
    "& .MuiTreeItem-iconContainer": {
      color: theme.palette.secondary.main,
    },
  },
}));
