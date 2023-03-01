import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles((theme) => ({
  chipList: {
    display: "flex",
    "& .MuiChip-label, .MuiChip-icon": {
      color: theme.palette.secondary.main,
    },
  },
  automated: {
    backgroundColor: "#d3d3ff",
  },
  completed: {
    backgroundColor: "#d3ffde",
  },
  groupHeader: {
    backgroundColor: "#fffbd3",
  },
  root: {
    backgroundColor: "#cccccc",
  },
  approved: {
    backgroundColor: "#d3fffe",
  },
  denied: {
    backgroundColor: "#ffd3d4",
  },
}));
