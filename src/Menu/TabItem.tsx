import React, { ReactElement, useState } from "react";
import { MenuAction } from "./MenuFunction";
import { ITechDataWebTabExtended } from "../Model/Extended/ITechDataWebTabExtended";
import { LazyTippy } from "../_components/LazyTippy";
import { Instance } from "tippy.js";
import { tabStyles } from "./TabList.styles";
import Tab from "@mui/material/Tab";
import IconManager from "../_components/IconManager";
import MenuDrag from "./MenuDrag";
import MenuActions from "./MenuActions";
import "../Menu/Menu.css";

type TabItemProps = {
  item: ITechDataWebTabExtended;
  onEdit: any;
  onDelete: any;
  elRefs: any;
  menuRef: any;
  onSetTabIndex: any;
  setCurrentTab: (id: number) => void;
  label: string;
  value: string;
  component: any;
  to: any;
  i: number;
  canDelete: boolean;
};

const TabItem: React.FC<TabItemProps> = ({
  item,
  onEdit,
  onDelete,
  elRefs,
  menuRef,
  onSetTabIndex,
  setCurrentTab,
  label,
  value,
  component,
  to,
  i,
  canDelete,
}): ReactElement => {
  const classes = tabStyles();
  const [isDragging, setIsDragging] = useState(false);
  // const [hideTooltips, setHideTooltips] = useState(true);

  function _styleProps(item: any) {
    return {
      id: `scrollable-auto-tab-${item.path}`,
      "aria-controls": `scrollable-auto-tabpanel-${item.path}`,
      //selected: item.isHighlighted,
    };
  }

  function _editTab(e: React.ChangeEvent<any>) {
    e.stopPropagation();
    e.preventDefault();
    // setHideTooltips(true);
    onEdit();
  }

  function _deleteTab(e: React.ChangeEvent<any>) {
    e.stopPropagation();
    e.preventDefault();
    // setHideTooltips(true);
    onDelete();
  }

  const dragDisabled = item.fixed || item.iTechDataCaseRowId !== null;
  const actions = [
    {
      icon: <IconManager icon="OpenWith" fontSize="small" style={{ cursor: "e-resize" }} />,
      name: "Drag to move",
      id: 1,
      fixed: dragDisabled,
      toolTipPlacement: "left",
    },
    {
      icon: <IconManager icon="Edit" fontSize="small" onClick={(e: any) => _editTab(e)} />,
      name: "Edit",
      id: 2,
      fixed: item.fixed,
      toolTipPlacement: "left",
    },
    {
      icon: <IconManager icon="Delete" fontSize="small" onClick={(e: any) => _deleteTab(e)} />,
      name: "Delete",
      id: 3,
      fixed: item.fixed,
      toolTipPlacement: "left",
    },
  ] as MenuAction[];

  if (!canDelete) {
    actions.splice(0, 1);
    actions.pop();
  }

  const [instance, setInstance] = useState<Instance>();

  // hide the tippy instance once an action clicked in content
  const hide = () => {
    instance?.hide();
  };

  // when isDragging increase the delay / border to keep the drag current
  return (
    <span className={classes.tabContainer}>
      <LazyTippy
        interactive={true}
        interactiveBorder={isDragging ? 100 : 2}
        placement="bottom"
        disabled={false}
        popperOptions={{ strategy: "fixed" }}
        appendTo="parent"
        delay={[500, isDragging ? 1000 : 0]}
        animation="scale"
        hideOnClick={"toggle"}
        onCreate={(i) => setInstance(i)}
        content={
          <MenuDrag
            item={item}
            menuRef={menuRef}
            elRefs={elRefs}
            onSetMenuIndex={onSetTabIndex}
            setIsDragging={setIsDragging}
            // setHideTooltips={setHideTooltips}
            direction="down"
            disabled={dragDisabled}
          >
            <MenuActions
              actions={actions}
              gid={""}
              onClick={hide}
              isDragging={isDragging}
              display="col"
            />
          </MenuDrag>
        }
      >
        <Tab
          key={item.rowId}
          label={label}
          disableRipple={isDragging}
          tabIndex={item.position || 0}
          ref={(el: any) => {
            elRefs.current[i] = el;
          }}
          onClick={() => setCurrentTab(item.rowId)}
          to={to}
          value={value}
          component={component}
          className={classes.tab}
          selected={item.isHightlighted}
          {..._styleProps(item)}
        />
      </LazyTippy>
    </span>
  );
};

export default TabItem;
