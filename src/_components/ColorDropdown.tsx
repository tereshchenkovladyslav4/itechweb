import React from "react";
import { MenuItem, Select, SelectProps } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { container } from "../_theme/baseTheme";

const useStyles = makeStyles((theme) => ({
  icon: {
    fill: theme.palette.button.main,
  },
  menuItem: {
    minHeight: 25,
    marginTop: 3,
    marginBottom: 3,
    minWidth:38,
    "& li:hover": {
      borderColor: "white",
      borderStyle: "solid",
      borderWidth: 3,
    },
  },
}));

interface ColorDropdownProps {
  items: string[];
  value?: string;
}
const ColorDropdown: React.FC<ColorDropdownProps & SelectProps> = ({
  items,
  value,
  ...rest
}: ColorDropdownProps) => {
  const classes = useStyles();

  return (
    <Select
      label="Color"
      variant="standard"
      value={value}
      {...rest}
      style={{ backgroundColor: value }}
      inputProps={{
        classes: {
          icon: classes.icon,
        },
      }}
      MenuProps={{
        classes: {
          list: classes.menuItem,
        },
        container: container,
      }}
    >
      {items?.map((col, i) => (
        <MenuItem
          key={i}
          value={col.toString()}
          className={classes.menuItem}
          style={{ backgroundColor: col.toString() }}
        >
          {" "}
        </MenuItem>
      ))}
    </Select>
  );
};

export default ColorDropdown;
