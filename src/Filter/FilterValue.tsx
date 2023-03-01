import React, { InputHTMLAttributes, ReactElement } from "react";
import UserSearch from "./UserSearch";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import makeStyles from '@mui/styles/makeStyles';
import DateRangePicker from "./DateRangePicker";
import FilterSelect from "./FilterSelect";
import DurationPicker from "./DurationPicker";
import { ITechType } from "../Model/iTechRestApi/ITechType";

const useStyles = makeStyles(() => ({
  formControl: {
    margin: 4,
    minWidth: 150,
    maxWidth: 200,
  },
  formControlUser: {
    margin: 4,
    minWidth: 400,
    maxWidth: 500,
  },
  checkBox: {
    height: 20,
    width: 20,
    // marginTop: 4,
    display:'table',
    verticalAlign:'middle',
  },
}));

interface IFilterValueProps {
  value: any;
  setValue: (v: any) => void;
  name: string;
  types: ITechType[];
  preventSubmit: (b: boolean) => void;
  datatype: number;
  fieldName: string;
  allowCron?: boolean;
  isLogin?: boolean;
}

export default function FilterValue({
  value,
  setValue,
  name,
  types,
  preventSubmit,
  datatype,
  fieldName,
  allowCron = false,
  isLogin = false,
}: IFilterValueProps): ReactElement {
  const classes = useStyles();

  if (datatype === 8) {
    //DateTime
    return (
      <DateRangePicker
        name={name}
        value={value}
        setValue={setValue}
        preventSubmit={preventSubmit}
        allowCron={allowCron}
      />
    );
  } else if (datatype === 1) {
    //Boolean
    const checked = String(value).toLowerCase() === "true";
    return (
      <Checkbox
        name={name}
        id={name}
        className={classes.checkBox}
        checked={checked}
        value={checked}
        onChange={(e) => setValue(e.target.checked)}
        inputProps={
          {
            "data-testid": name,
          } as unknown as InputHTMLAttributes<HTMLInputElement>
        }
      />
    );
  } else if (datatype === 5 && fieldName === "duration") {
    return (
      <DurationPicker
        name={name}
        value={value}
        setValue={setValue}
        className={classes.formControl}
      />
    );
  }

  return (
    <FormControl
      className={[13, 14, 15].includes(datatype) ? classes.formControlUser : classes.formControl}
    >
      {datatype === 9 ? ( //String
        <TextField
          name={name}
          id={name}
          label="Value"
          value={value || ""}
          onChange={(e) => setValue(e.target.value)}
        />
      ) : [4, 5, 6].includes(datatype) ? ( //Int/Long/Float
        <TextField
          name={name}
          id={name}
          label="Value"
          type="number"
          value={value || ""}
          onChange={(e) => setValue(e.target.value)}
        />
      ) : datatype === 12 ? ( //Type
        <FilterSelect
          label="Type"
          types={types}
          handleChange={(id, v) => setValue(v)}
          id={name}
          value={value}
        />
      ) : [13, 14, 15, 17].includes(datatype) ? ( //User/SecurityObject/Identifier/UserGroup
        <UserSearch datatype={datatype} value={value} setValue={setValue} isLogin={isLogin} />
      ) : (
        <></>
      )}
    </FormControl>
  );
}
