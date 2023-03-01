import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import DroppableDisplay from "./DroppableDisplay";
import ChildDisplay from "./ChildDisplay";
import ParentDisplay from "./ParentDisplay";

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  result.map((i, index) => (i.index = index));

  return result;
};

const Form = (props) => {
  const parent = props.items.length === 1 && props.items[0];
  return (
    <DragDropContext onDragEnd={props.onDragEnd}>
      {props.items.length === 1 && parent.subItems?.length > 0 ? (
        <DroppableDisplay
          droppableId={parent.id}
          droppableType="droppableSubItem"
          items={parent.subItems}
          display={(provided, snapshot, item) => (
            <ChildDisplay
              provided={provided}
              snapshot={snapshot}
              item={item}
              parentId={parent.rowId.toString()}
              updateItem={props.updateItem}
            />
          )}
        />
      ) : (
        <DroppableDisplay
          droppableId="droppable"
          droppableType="droppableItem"
          items={props.items}
          display={(provided, snapshot, item) =>
            item.display ? (
              item.display(provided, snapshot, item, props.updateItem)
            ) : (
              <ParentDisplay
                provided={provided}
                snapshot={snapshot}
                item={item}
                updateItem={props.updateItem}
              />
            )
          }
        />
      )}
    </DragDropContext>
  );
};

export default function KeyTypeDrag(props) {
  function _onDragEnd(result) {
    if (!result.destination) {
      return;
    }
    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;
    if (result.type === "droppableItem") {
      const items = reorder(props.items, sourceIndex, destIndex);

      props.setItems(items);
    } else if (result.type === "droppableSubItem") {
      const itemSubItemMap = props.items.reduce((acc, item) => {
        acc[item.id] = item.subItems;
        return acc;
      }, {});

      const sourceParentId = result.source.droppableId;
      const destParentId = result.destination.droppableId;

      const sourceSubItems = itemSubItemMap[sourceParentId];
      //const destSubItems = itemSubItemMap[destParentId];

      let newItems = [...props.items];

      /** In this case subItems are reOrdered inside same Parent */
      if (sourceParentId === destParentId) {
        const reorderedSubItems = reorder(sourceSubItems, sourceIndex, destIndex);
        newItems = newItems.map((item) => {
          if (item.id === sourceParentId) {
            item.subItems = reorderedSubItems;
          }
          return item;
        });
        props.setItems(newItems);
      }
      // Do not need to place into another parent!
      // else {
      //   let newSourceSubItems = [...sourceSubItems];
      //   const [draggedItem] = newSourceSubItems.splice(sourceIndex, 1);

      //   let newDestSubItems = [...destSubItems];
      //   newDestSubItems.splice(destIndex, 0, draggedItem);
      //   newItems = newItems.map(item => {
      //     if (item.id === sourceParentId) {
      //       item.subItems = newSourceSubItems;
      //     } else if (item.id === destParentId) {
      //       item.subItems = newDestSubItems;
      //     }
      //     return item;
      //   });
      //   this.setState({
      //     items: newItems
      //   });
      // }
    }
  }

  function _updateItem(item) {
    const updates = [...props.items];

    updates.map((i) => {
      if (i.id === item.id) {
        return item;
      }
      i.subItems.map((s) => (s.id === item.id ? item : s));
      return i;
    });
    props.setItems(updates);
  }

  return <Form items={props.items} onDragEnd={_onDragEnd} updateItem={_updateItem} />;
}
