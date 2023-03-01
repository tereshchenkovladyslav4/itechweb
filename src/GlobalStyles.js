import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) =>
  createStyles({
    "@global": {
      body: {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.primary.contrastText,
        //bit if a hack having this here - settings page not picking up font for some reason
        //fontFamily: "Open Sans, Arial, Helvetica, sans-serif",
        overflow: "hidden",
      },
    },
  })
);

const GlobalStyles = () => {
  useStyles();
  return null;
};

export default GlobalStyles;
