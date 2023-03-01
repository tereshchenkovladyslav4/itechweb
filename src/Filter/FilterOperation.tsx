import React, { ReactElement } from "react";
import MenuItem from "@mui/material/MenuItem";
import LabelSelect from "../_components/LabelSelect";

interface IOperationProps {
  value: any;
  types?: string[];
  handleChange: (value: any) => void;
}

export default function Operation({ value, types, handleChange }: IOperationProps): ReactElement {
  const operation = !value ? (types ? types[0] : "") : value;
  return (
    <LabelSelect label="Operation" onChange={(e) => handleChange(e.target.value)} value={operation}>
      {types?.map((type) => (
        <MenuItem key={type} value={type}>
          {type}
        </MenuItem>
      ))}
    </LabelSelect>
  );
}
