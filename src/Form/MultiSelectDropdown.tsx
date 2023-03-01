import * as React from "react";
import makeStyles from "@mui/styles/makeStyles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";
import { ClickAwayListener } from "@mui/material";

const useStyles = makeStyles(() => ({
  root: {
    "& legend": {
      display: "none",
    },
    "& fieldset": {
      top: 0,
    },
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

type MultiMenuProps = {
  i: number;
  val: { key: number; value: string; tooltip?: string };
  disabledSelection: number[];
};
const MultiMenu: React.FC<MultiMenuProps> = ({ i, val, disabledSelection }) => {
  const [open, setOpen] = useState(false);
  const handleTooltipClose = () => {
    setOpen(false);
  };
  const handleTooltipOpen = () => {
    setOpen(true);
    console.log("CLICK");
  };

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <Tooltip
        key={`menuTooltip${i}`}
        title="Tooltip"
        onClose={handleTooltipClose}
        open={open}
        disableTouchListener
      >
        <span>
          <MenuItem
            key={i}
            value={val.key}
            disabled={disabledSelection.includes(i)}
            onClick={handleTooltipOpen}
          >
            {val.value}
          </MenuItem>
        </span>
      </Tooltip>
    </ClickAwayListener>
  );
};

type MultiSelectDropdownProps = {
  values: Array<{ key: number; value: string }>;
  selected: number[];
  setSelected: (selected: number[]) => void;
  disabled?: boolean;
  disabledSelection?: number[];
};

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  values,
  selected,
  setSelected,
  disabled,
  disabledSelection = [],
}) => {
  const classes = useStyles();
  //const [selected, setSelected] = useState<number[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof selected>) => {
    setSelected(event.target.value as typeof selected);
  };

  return (
    <div>
      <FormControl sx={{ width: 300 }}>
        <Select
          className={classes.root}
          multiple
          value={selected}
          disabled={disabled}
          onChange={handleChange}
          input={<OutlinedInput id="multiSelectChip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((val, i) => (
                <Chip
                  key={i}
                  label={values.find((x) => x.key === val)?.value ?? ""}
                  disabled={disabledSelection.includes(val)}
                />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {values.map((val, i) => (
            <MenuItem key={i} value={val.key} disabled={disabledSelection.includes(i)}>
              {val.value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default MultiSelectDropdown;
