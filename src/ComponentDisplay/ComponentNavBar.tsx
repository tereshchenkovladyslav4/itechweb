import React, { ChangeEvent } from "react";
import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import { Direction } from "../Model/Types/Direction";
import { useStore } from "../_context/Store";
import { MoveSelectedEvent, MoveSelectedItemEvent, trigger } from "../_helpers/events";
import { useStyles } from "./Component.styles";
import { ComponentType } from "./componentType";
import NavButton from "../_components/NavButton";
import SelectableList from "../_components/SelectableList";
import { IconButton, Tab, Tabs } from "@mui/material";
import { isFilterGroupColor, toSentence } from "../_helpers/utilities";

export { ComponentNavBar, ComponentTabs };

interface menu {
  componentType: ComponentType;
  icon: string;
}
const menuOptions: menu[] = [
  {
    componentType: ComponentType.Properties,
    icon: "ListAlt",
  },
  {
    componentType: ComponentType.Preview,
    icon: "GraphicEq",
  },
  {
    componentType: ComponentType.NoteList,
    icon: "Notes",
  },
  {
    componentType: ComponentType.ObjectAudit,
    icon: "VerifiedUser",
  },
  {
    componentType: ComponentType.Versions,
    icon: "Timeline",
  },
];

interface IComponentNavBarProps {
  data: any;
  updateData: (data: any) => void;
}

const ComponentTabs: React.FC<IComponentNavBarProps> = ({ data, updateData }) => {
  if (!data || data.hideNav) return null;
  if (!menuOptions.some((x) => x.componentType === data.componentType)) return null;

  const classes = useStyles();
  const { selectors } = useStore();
  const isCurrentFilterGroupColor = isFilterGroupColor(selectors.getSelectedGridRow(), data);

  const _onDirectionClick = (direction: Direction) => {
    trigger(MoveSelectedItemEvent, {
      direction: direction,
    } as MoveSelectedEvent);
  };

  const _updateComponent = (e: ChangeEvent<unknown>, value: any) => {
    const subData = data?.data;

    updateData({
      componentType: value,
      wizardType: value,
      wizardState: undefined,
      filterGroupColor: data.filterGroupColor,
      data: subData,
    });
  };

  return (
    <div className={classes.componentList} data-testid="component-nav-header">
      <Tabs
        value={data.componentType}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="object-tabs"
        onChange={_updateComponent}
        className={classes.tabs}
      >
        <IconButton
          className={classes.iconButton}
          onClick={() => _onDirectionClick(Direction.Up)}
          disabled={!isCurrentFilterGroupColor}
          size="large">
          <ArrowLeft />
        </IconButton>
        {menuOptions.map((menu) => {
          return (
            <Tab
              key={menu.componentType}
              label={toSentence(menu.componentType)}
              value={menu.componentType}
            />
          );
        })}
        <IconButton
          className={classes.iconButton}
          onClick={() => _onDirectionClick(Direction.Down)}
          disabled={!isCurrentFilterGroupColor}
          size="large">
          <ArrowRight />
        </IconButton>
      </Tabs>
    </div>
  );
};

const ComponentNavBar: React.FC<IComponentNavBarProps> = ({ data, updateData }) => {
  if (!data || data.hideNav) return null;
  if (!menuOptions.some((x) => x.componentType === data.componentType)) return null;

  const classes = useStyles();
  const { selectors } = useStore();
  const isCurrentFilterGroupColor = isFilterGroupColor(selectors.getSelectedGridRow(), data);

  const _onDirectionClick = (direction: Direction) => {
    trigger(MoveSelectedItemEvent, {
      direction: direction,
    } as MoveSelectedEvent);
  };

  const _updateComponent = (e: any) => {
    const subData = data?.data;

    updateData({
      componentType: e.name,
      wizardType: e.name,
      wizardState: undefined,
      filterGroupColor: data.filterGroupColor,
      data: subData,
    });
  };

  return (
    <div className={classes.componentList} data-testid="component-nav-header">
      <NavButton
        onClick={() => _onDirectionClick(Direction.Up)}
        disabled={!isCurrentFilterGroupColor}
      >
        <ArrowLeft />
      </NavButton>
      <SelectableList
        items={menuOptions}
        selectedItem={data.componentType}
        updateComponent={_updateComponent}
      />
      <NavButton
        onClick={() => _onDirectionClick(Direction.Down)}
        disabled={!isCurrentFilterGroupColor}
      >
        <ArrowRight />
      </NavButton>
    </div>
  );
};
