import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles((theme) => ({
    root: {
      "& span:hover": {
        cursor: "pointer",
        textDecoration: "underline",
      },
      padding: theme.spacing(2),
    },
    plainText: {
      padding: theme.spacing(2),
      ...theme.typography.body2,
    },
    speakerContainer: {
      padding: "8px 20px",
      borderRadius: 5,
      width: "fit-content",
      blockSize: "fit-content",
      lineHeight: 1.4,
      ...theme.typography.body2,
      fontFamily: theme.typography.fontFamily,
      backgroundColor: theme.palette.mode === "light" ? "#fff" : "#292929",//"light" ? "#f5f5f5" : "#1f1f1f", // TODO - solve why theme augmentation with teams always gives dark mode value
      // backgroundColor: theme.palette.teams.paper,
      margin: theme.spacing(1),
      // maxWidth: "calc(100% - 20px)",
      minWidth: 300,
    },
    speakerText: {
      marginBottom: 4,
      width: "100%",
    },
  }));
  