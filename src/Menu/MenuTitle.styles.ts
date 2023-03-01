import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles((theme) => ({
  icon: {
    padding: 8,
    color: theme.palette.button?.main,
    marginLeft: 5,
  },
  menuTitle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(0, 1),
    minHeight: 80,
    //minHeight: (props: MenuStyleProps) => props.height,
    // necessary for content to be below app bar
    //...theme.mixins.toolbar,
  },
}));
