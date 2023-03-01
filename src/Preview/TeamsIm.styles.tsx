import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: 40,
    paddingBottom: 10,
    background: theme.palette.mode === "light" ? '#f5f5f5': '#1f1f1f',
    // background: theme.palette.teams.paper,
    // minHeight: "calc(100% - 51px)", -- if dont always want a scrollbar cos of padding
    minHeight: "calc(100% - 40px)",
  },
  message: {
    background: theme.palette.mode === "light" ? "#fff" : "#292929",
    // background: theme.palette.teams.message,
    padding: "8px 20px",
    borderRadius: 5,
    width: "fit-content",
    blockSize: "fit-content",
    lineHeight: 1.4,
    fontSize: 14,
    maxWidth: "80%",
    minWidth: 300,
    margin: 10,
    color: theme.palette.mode === "light" ? "rgb(36, 36, 36)" : "#ececec",
    fontFamily: "'Segoe UI', system-ui, 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif",
  },
  reactions: {
    float: "right",
    lineHeight: 0,
    fontSize: 12,
    margin: "6px 0 0 10px",
  },
  user: {
    fontWeight: 600,
    fontSize: 12,
    margin: "0 0 5px 0",
    color: theme.palette.mode === "light" ? "rgb(36, 36, 36)" : "#d6d6d6",
    width: "fit-content",
    float: "left",
  },
  date: {
    fontSize: 12,
    color: theme.palette.mode === "light" ? "rgb(97, 97, 97)" : "#797979",
    margin: "0 0 5px 15px",
    width: "fit-content",
    float: "left",
  },
  body: {
    clear: "both",
    margin: 0,
    padding: 0,
    "& p": {
      margin: 0,
      padding: 0,
    },
  },
}));
