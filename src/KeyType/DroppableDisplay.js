import React from "react";
import ReactDOM from "react-dom";
import { Droppable, Draggable } from "react-beautiful-dnd";

const portal = document.createElement("div");
document.body.appendChild(portal);

export default function DroppableDisplay(props) {
  const grid = 8;
  const _getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? "#3c185b" : "lightgrey",
    padding: grid,
    //width: 300,
  });

  const PortalAwareItem = (props) => {
    const display = (
      <div ref={props.provided.innerRef}>
        {props.display}
        {props.provided.placeholder}
      </div>
    );

    return props.snapshot.isDragging ? ReactDOM.createPortal(display, portal) : display;
  };

  return (
    <Droppable droppableId={props.droppableId} type={props.droppableType}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} style={_getListStyle(snapshot.isDraggingOver)}>
          {props.items.map((item, index) => (
            <Draggable key={item.id} draggableId={item.id} index={index}>
              {(provided, snapshot) => (
                <PortalAwareItem
                  display={props.display(provided, snapshot, item)}
                  provided={provided}
                  snapshot={snapshot}
                />
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
