import React from "react";
import { MenuItem, Select, SelectProps } from "@mui/material";
import ReplayIcon from '@mui/icons-material/Replay';
import makeStyles from '@mui/styles/makeStyles';
import { container } from "../_theme/baseTheme";

const useStyles = makeStyles((theme) => ({
  icon: {
    fill: theme.palette.primary.main,
  },
  iconDefault: {
    fill: "white",
  },
  iconPos: {
    position: "absolute", left: ".1rem", cursor:'pointer',
  },
  menuItem: {
    minHeight: 25,
    marginTop: 3,
    marginBottom: 3,
    minWidth:104,
    "& li:hover": {
      borderColor: "white",
      borderStyle: "solid",
      borderWidth: 3,
    },
  },
}));

interface RefreshDropdownProps {
  items: string[];
  value?: string;
}
const RefreshDropdown: React.FC<RefreshDropdownProps & SelectProps> = ({
  items,
  value,
  ...rest
}: RefreshDropdownProps) => {
  const classes = useStyles();

  return (
    <Select
      IconComponent={ReplayIcon} 
      label="Color"
      variant="standard"
      value={""} 
      style={{backgroundColor:"unset"}}
      {...rest}
      inputProps={{
        classes: {
          icon: value !== undefined && value !== items[0] ? classes.icon : classes.iconDefault       
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
          value={col}
          selected={value === col}
          className={classes.menuItem}
          style={{ backgroundColor: "white" }}
        >
          {col}
        </MenuItem>
      ))}

    </Select>
  );
};

export default RefreshDropdown;