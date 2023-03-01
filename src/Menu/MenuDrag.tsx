import React from "react";
import Draggable from "react-draggable";

interface IMenuDragProps {
  item: any; // should be ITechDataWebMenuExtended but missing prop index
  menuRef: any;
  elRefs: any;
  direction: "right" | "down";
  onSetMenuIndex: any;
  setIsDragging: (hide: boolean) => void;
  // setHideTooltips: (hide: boolean) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

const MenuDrag: React.FC<IMenuDragProps> = ({
  item,
  menuRef,
  elRefs,
  direction,
  onSetMenuIndex,
  setIsDragging,
  // setHideTooltips,
  disabled,
  children,
}) => {
  const dragRef = React.createRef<any>();
  const [bounds, setBounds] = React.useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });
  // const children = React.Children.map(props.children, (child) => {
  //   return React.cloneElement(child, { ...props });
  // });
  const position = { x: 0, y: 0 };
  let tabIndex = -1;

  function _onStartDrag() {
    setIsDragging(true);
    // setHideTooltips(true);
    //if (
    //  menuRef.current &&
    //  menuRef.current.getBoundingClientRect().top !== -bounds.top
    //) {

    const menuRect = menuRef.current.getBoundingClientRect();
    const dragRect = dragRef.current.getBoundingClientRect();

    const bounds = {
      top: menuRect.top - dragRect.top,
      bottom: menuRect.bottom - dragRect.bottom,
      left: menuRect.left - dragRect.left,
      right: menuRect.right - dragRect.right,
    };
    setBounds(bounds);
  }
  //}

  function _onStopDrag() {
    elRefs.current.forEach((listItem: any) => {
      const button = listItem;
      if (button) {
        button.style.border = "";
      }
    });

    onSetMenuIndex(item, tabIndex);

    tabIndex = -1;
    setIsDragging(false);
    // setHideTooltips(true);
  }

  function _onDrag({ event }: any) {
    event.stopPropagation();
    event.preventDefault();
    let found = false;
    elRefs.current.forEach((listItem: any) => {
      const dragRect = dragRef.current.getBoundingClientRect();
      const absPos = {
        vertical: dragRect.bottom - dragRect.height / 2,
        horizontal: dragRect.right - dragRect.width / 2,
      };
      const button = listItem;
      if (button) {
        const childRect = button.getBoundingClientRect();
        const childIndex = Number.parseInt(button.getAttribute("tabIndex"));

        if (direction === "right") {
          const halfHeight = childRect.height / 2;
          if (!found && absPos.vertical < childRect.bottom - halfHeight) {
            button.style.borderTop = "2px solid #4a7ab5";
            found = true;
            tabIndex = childIndex + (item.index > childIndex ? 0 : -1);
          } else {
            button.style.borderTop = "";
          }

          if (!found && absPos.vertical < childRect.bottom + halfHeight) {
            button.style.borderBottom = "2px solid #4a7ab5";
            found = true;
            tabIndex = childIndex + (item.index > childIndex ? 1 : 0);
          } else {
            button.style.borderBottom = "";
          }
        }

        if (direction === "down") {
          const halfWidth = childRect.width / 2;
          if (!found && absPos.horizontal < childRect.right - halfWidth) {
            button.style.borderLeft = "2px solid #4a7ab5";
            found = true;
            tabIndex = childIndex; //+ (item.index > childIndex ? 0 : -1);
          } else {
            button.style.borderLeft = "";
          }

          if (!found && absPos.horizontal < childRect.right + halfWidth) {
            button.style.borderRight = "2px solid #4a7ab5";
            found = true;
            tabIndex = childIndex + (item.index > childIndex ? 1 : 0);
          } else {
            button.style.borderRight = "";
          }
        }
      }
    });
  }

  return (
    <Draggable
      axis={direction === "right" ? "y" : "x"}
      handle=".draggable"
      onStart={_onStartDrag}
      onStop={_onStopDrag}
      onDrag={(event) => _onDrag({ event })}
      bounds={bounds}
      position={position}
      disabled={disabled}
    >
      <div ref={dragRef} key={item.index}>
        {children}
      </div>
    </Draggable>
  );
};

export default MenuDrag;
