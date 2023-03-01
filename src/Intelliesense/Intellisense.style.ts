import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles((theme) => ({
  root: {
    flexWrap: "wrap",
    position: "relative",
    width: "100%",
    margin: "5px 10px 0 10px",
  },
  title: {
    fontSize: "1em",
  },
  editable: {
    border: "1px solid #CCC",
    padding: 3,
    borderRadius: 3,
    minHeight: 18,
    cursor: "text",
    // zIndex:1401,
    fontFamily: '"Source Code Pro", monospace',
    backgroundColor: theme.palette.background.default,
    overflowX: "auto",
    "& pre": {
      margin: 0,
      fontFamily: "inherit",
    },
  },
  autocomplete: {
    position: "fixed",
    background: "#FFF",
    border: "1px solid #CCC",
    borderRadius: 3,
    zIndex: 100,
    overflowY: "auto",
    maxHeight: 400,
    backgroundColor: theme.palette.background.paper,
  },
  autoItem: {
    padding: "0 3px",
  },
  groups: {
    position: "fixed",
    background: "rgb(212, 35, 4, 0.5)",
    border: "1px solid #CCC",
    borderRadius: 3,
    zIndex: 100,
    pointerEvents: "none", // this prevents hover.... as does making elements fixed and assigning zindex ( which also causes caret issue when click at end )
    "&:hover": {
      borderColor: "#000",
      // pointerEvents: 'none'
    },
  },
  "@keyframes blinker": {
    from: { opacity: 1 },
    to: { opacity: 0 },
  },
  caret: {
    height: 22,
    // borderLeft: "1px solid #000",
    borderLeft: "2px solid",
    borderColor: theme.palette.primary.contrastText,
    pointerEvents: "none",
    position: "absolute",
    top: 48,
    left: 3,
    animationName: "$blinker",
    animationDuration: "1s",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
  },
  term: {
    padding: "0px 1px",
    // backgroundColor: "#2a2",
    "&:hover": {
      border: "1px solid",
      borderRadius: 3,
      padding: 0,
    },
  },
  word: {
    padding: "0px 1px",
    // backgroundColor: "#03a9f4",
    "&:hover": {
      border: "1px solid",
      borderRadius: 3,
      padding: 0,
    },
  },
  highlight: {
    backgroundColor: "#2a2 !important", // chrome selected color is #3297FD
    color: "#ffffff",
  },
  operator: {
    backgroundColor: theme.palette.primary.main,
    borderRadius: 3,
    padding: "0px 1px",
    color: "#ffffff",
    // color:theme.palette.primary.contrastText,
  },
  deleteOperator: {
    width: "1.6em",
    height: "1.6em",
    minHeight: 0,
    boxShadow: "0 0",
  },
  // alternatives: {
  //   backgroundColor: "#ff9800c7",
  // },
  altColor0: { backgroundColor: "#2a2" }, //green
  altColor1: { backgroundColor: "#ff9800c7" }, // orange
  altColor2: { backgroundColor: "#00bcd4" }, // light blue
  altColor3: { backgroundColor: "#dfd237" }, // yellow
  altColor4: { backgroundColor: "#ed89ab" }, // pink
  altColor5: { backgroundColor: "#9389ed" }, // purple
}));
