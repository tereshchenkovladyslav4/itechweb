import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { DragIndicator } from "@mui/icons-material/";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Checkbox from "@mui/material/Checkbox";
import DroppableDisplay from "./DroppableDisplay";
import ChildDisplay from "./ChildDisplay";
import { useStyles, getItemStyle } from "./RuleDisplay.styles";

export default function ParentDisplay(props) {
  const { provided, snapshot, item, updateItem } = props;
  const classes = useStyles();
  const parentId = item.rowId.toString();
  const checked = item.checked ? item.checked : false;

  const _onChildChecked = (child) => {
    updateItem(child);

    if (child.checked) item.checked = true;
    item.open = true;
    updateItem(item);
  };

  const _onOpen = (item) => {
    item.open = !item.open;
    updateItem(item);
  };

  const _update = (checked, item) => {
    item.checked = checked;
    updateItem(item);
  };

  return (
    <Accordion
      // innerRef={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
      TransitionProps={{ mountOnEnter: true, unmountOnExit: false }}
      expanded={item.open}
      onClick={() => _onOpen(item)}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography className={classes.heading}>
          <DragIndicator className={classes.dragIcon} />
          <Checkbox
            name={`${parentId}-${item.index}`}
            id={item.id}
            variant="standard"
            className={classes.checkBox}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => _update(e.target.checked, item)}
            checked={checked}
          />
          {item.description}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <DroppableDisplay
          droppableId={item.id}
          droppableType="droppableSubItem"
          items={item.subItems}
          display={(provided, snapshot, item) => (
            <ChildDisplay
              provided={provided}
              snapshot={snapshot}
              item={item}
              parentId={parentId}
              updateItem={_onChildChecked}
            />
          )}
        />
      </AccordionDetails>
    </Accordion>
  );
}
