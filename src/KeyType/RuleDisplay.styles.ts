import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles((theme) => ({
  ruleChip: {
    border: "1px solid #CCC",
    padding: 5,
  },
  cardDrag: {
    height: 42,
    padding: "5px 0",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  score: {
    position: "absolute",
    right: 40,
    width: 80,
  },
  removeRule: {
    width: "1.6em",
    height: "1.6em",
    maxWidth: "1.6em",
    maxHeight: "1.6em",
    minHeight: 0,
    boxShadow: "0 0",
    position: "absolute",
    right: 10,
    top: 11,
  },
  container: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    // fontWeight: theme.typography.fontWeightRegular,
  },
  dragIcon: {
    marginBottom: -7,
  },
  chipDragIcon: {
    marginTop: 5,
  },
  cardcontent: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize,
    padding: 5,
    "&:last-child": {
      paddingBottom: 2,
    },
  },
  accordianDetails: {
    padding: 0,
  },
  accordionButton: {
    float: "right",
  },
  checkBox: {
    height: 20,
    width: 20,
    marginRight:theme.spacing(1),
  },
  ruleText: {
    paddingRight: 120,
    maxHeight: 42,
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "normal",
    display: "-webkit-box",
    "-webkit-box-orient": "vertical",
    "-webkit-line-clamp": 2,
  },
  disabled: {
    color: theme.palette.warning.main,
    "& .MuiSvgIcon-root": {
      color: theme.palette.warning.main,
    },
  },
}));

export const getItemStyle = (isDragging: any, draggableStyle: any) => ({
  userSelect: "none",
  margin: `0 0 8px 0`,
  background: isDragging && "#4a7ab5",
  // styles we need to apply on draggables
  ...draggableStyle,
});
