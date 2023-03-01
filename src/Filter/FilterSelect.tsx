import React, { ReactElement } from "react";
import MenuItem from "@mui/material/MenuItem";
import _ from "lodash";
import { ITechControlColumn } from "../Model/iTechRestApi/ITechControlColumn";
import { ITechControlTable } from "../Model/iTechRestApi/ITechControlTable";
import { ITechType } from "../Model/iTechRestApi/ITechType";
import LabelSelect from "../_components/LabelSelect";

interface IFilterSelectProps {
  value?: number | null;
  types: ITechControlColumn[] | ITechControlTable[] | ITechType[];
  label: string;
  id: number | string | null;
  handleChange: (id: any, value: any) => void;
}

export default function FilterSelect({
  value,
  types,
  label,
  id,
  handleChange,
}: IFilterSelectProps): ReactElement {
  const val = value === undefined || !_.find(types, { rowId: value }) ? "" : value;
  return (
    <LabelSelect label={label} onChange={(e) => handleChange(id, e.target.value)} value={val}>
      {(types as any[])
        ?.filter((x) => x.abb !== null)
        .map((type) => (
          <MenuItem key={type.rowId} value={type.rowId}>
            {type.description || type.abb}
          </MenuItem>
        ))}
    </LabelSelect>
  );
}
