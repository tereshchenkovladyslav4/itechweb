import React, { ReactElement, useState } from "react";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import { convertMstoTime, convertTimetoMs } from "../_helpers/durationConverter";

interface IDurationPickerProps {
  value: any;
  setValue: (v: any) => void;
  name: string;
  className: string;
}

export default function DurationPicker({
  value,
  setValue,
  name,
  className,
}: IDurationPickerProps): ReactElement {
  const [val, setVal] = useState(convertMstoTime(value));

  return (
    <FormControl className={className}>
      <TextField
        name={name}
        id={name}
        label="Value"
        value={val || ""}
        onChange={(e) => {
          const msVal = convertTimetoMs(e.target.value);
          setVal(e.target.value);
          setValue(msVal);
        }}
      />
    </FormControl>
  );
}
