import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { DragIndicator } from "@mui/icons-material/";
import { Typography, Checkbox } from "@mui/material";
import { useStyles, getItemStyle } from "./RuleDisplay.styles";

export default function ChildDisplay(props) {
  const { provided, snapshot, item, parentId, updateItem } = props;
  const classes = useStyles();
  const childId = item.rowId.toString();
  const checked = item.checked ? item.checked : false;

  const _update = (checked, item) => {
    item.checked = checked;
    updateItem(item);
  };

  return (
    <Card
      // innerRef={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
    >
      <CardContent className={classes.cardcontent}>
        <DragIndicator className={classes.dragIcon} />
        <Checkbox
          name={`${parentId}-${childId}-${item.index}`}
          id={item.id}
          variant="standard"
          className={classes.checkBox}
          onChange={(e) => _update(e.target.checked, item)}
          checked={checked}
        />
        <Typography variant="caption">{item.description}</Typography>
      </CardContent>
    </Card>
  );
}
