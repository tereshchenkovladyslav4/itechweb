import React from "react";
import { MenuItem, Select, SelectProps } from "@mui/material";
import { TimePeriodEnum } from "../Model/iTechRestApi/TimePeriodEnum";
import { getEnumKeyValues } from "../_helpers/helpers";

interface TimePeriodDropdownProps {
  value?: number;
  setValue: (val: number) => void;
  showAll?: boolean;
}

const TimePeriodDropdown: React.FC<TimePeriodDropdownProps & SelectProps> = ({
  value,
  setValue,
  showAll = true,
  ...rest
}: TimePeriodDropdownProps) => {
  const items = getEnumKeyValues(
    TimePeriodEnum,
    (x: [string, any]) => showAll || x[0] !== TimePeriodEnum[TimePeriodEnum.all]
  );

  return (
    <Select
      value={value || -1}
      onChange={(e) => (e.target.value === -1 ? setValue(0) : setValue(Number(e.target.value)))}
      style={{ minWidth: 122 }}
      autoWidth
      {...rest}
    >
      <MenuItem key={-1} value={-1}>
        Time Period
      </MenuItem>
      {items?.map((x) => (
        <MenuItem key={x.value} value={x.value}>
          {x.name}
        </MenuItem>
      ))}
    </Select>
  );
};

export default TimePeriodDropdown;
