import React, { useEffect } from "react";
import { ListButton } from "../ComponentDisplay/ListButton";
import List from "@mui/material/List";
import makeStyles from '@mui/styles/makeStyles';
import { toSentence } from "../_helpers/utilities";

const useStyles = makeStyles(() => ({
  componentList: {
    display: "flex",
    justifyContent: "stretch",
    flexGrow: 1,
  },
}));

interface SelectableListProps {
  selectedItem: any;
  items: any;
  updateComponent: any;
}

const SelectableList: React.FC<SelectableListProps> = ({
  selectedItem,
  items,
  updateComponent,
}: SelectableListProps) => {
  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = React.useState(-1);

  useEffect(() => {
    items.forEach((item: any, index: number) => {
      if (item.componentType === selectedItem) {
        setSelectedIndex(index);
      }
    });
  }, []);

  const handleListItemClick = (event: any, index: any) => {
    updateComponent(event);
    setSelectedIndex(index);
  };

  return (
    <List
      aria-labelledby="nested-list-subheader"
      className={classes.componentList}
      disablePadding={true}
    >
      {items.map((item: any, index: number) => {
        return (
          <ListButton
            key={index}
            icon={item.icon}
            name={toSentence(item.componentType)}
            clickHandler={(event: any) => handleListItemClick(event, index)}
            selected={selectedIndex === index}
          />
        );
      })}
    </List>
  );
};

export default SelectableList;
