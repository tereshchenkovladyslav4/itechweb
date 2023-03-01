import React from "react";
import { DragIndicator } from "@mui/icons-material/";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import { TextField } from "@mui/material";
import { TinyButton } from "../_components/TinyButton";
import { useStyles, getItemStyle } from "./RuleDisplay.styles";
import clsx from "clsx";

export default function RuleDisplay(props: any) {
  const { provided, snapshot, item } = props;
  const classes = useStyles();

  return (
    <Card
      variant="outlined"
      className={clsx(classes.cardDrag, {
        [classes.disabled]: item.disabled === true,
      })}
      // innerRef={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
    >
      <DragIndicator className={classes.chipDragIcon} />
      <Typography className={classes.ruleText} variant="subtitle1" component="span">
        {item.description} : <i>{item.ruleType}</i>
      </Typography>
      <TextField
        name="threshold"
        label="Score"
        type="number"
        value={item.score ?? 1}
        onChange={(e) => item?.setScore(parseInt(e.target.value))}
        className={classes.score}
      />
      <TinyButton icon="Clear" className={classes.removeRule} onClick={() => item?.delete()} />
    </Card>
  );
}
