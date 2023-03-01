import React, { MouseEvent } from "react";
import { Menu, MenuItem } from "@mui/material";
import { eChartMenuOption } from "./IFilteredChart";

interface IChartMenuProps {
  el: any;
  close(): void;
  clicked?(data: any): void;
  actions?: eChartMenuOption[];
}

const ChartMenu: React.FC<IChartMenuProps> = ({
  el,
  close,
  clicked,
  actions = [
    eChartMenuOption.newGridView,
    eChartMenuOption.filterCurrentTabGrids,
    eChartMenuOption.showGrid,
  ],
}) => {
  // clicked is the call back on chartwiz

  // remove new tab when opened for invesitgation templates
  if(sessionStorage.getItem("investigationId") !== null){
    actions = actions.filter(x => x !== eChartMenuOption.newGridView);
  }
  // indexes correspond to eChartMenuOption entries
  const chartMenuOptions = [
    "Unknown",
    "New Tab Grid View",
    "Apply Filter",
    "Show as Grid",
    "Open",
    "Open Full Screen",
    "Open in New Tab",
  ];

  // the menu click handler
  const handleClick = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const element: any = e.currentTarget;
    const value = element["value"];

    if (clicked) {
      clicked(value);
    }
    close();
  };

  return (
    <Menu
      anchorReference="anchorPosition"
      onClose={close}
      open={el.mouseY !== null}
      anchorPosition={
        el.mouseY !== null && el.mouseX !== null ? { top: el.mouseY, left: el.mouseX } : undefined
      }
    >
      {actions.map((action) => (
        <MenuItem key={action} onClick={handleClick} value={action}>
          {chartMenuOptions[action]}
        </MenuItem>
      ))}
    </Menu>
  );
};

export default ChartMenu;
