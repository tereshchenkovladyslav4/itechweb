import React, { ReactElement, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { CheckCircle, Cancel } from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

type SaveFilterProps = {
  filterName?: string;
  onFormSave: (newFilter: any, name: any) => void;
  onCloseForm: () => void;
  canUpdate: boolean; // true only if current user created filter
};

const SaveFilter: React.FC<SaveFilterProps> = ({
  filterName,
  onFormSave,
  onCloseForm,
  canUpdate,
}): ReactElement => {
  const [newFitler, setNewFilter] = useState(true);
  const [name, setName] = useState("");
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    setNewFilter(filterName === undefined || !canUpdate);
    setName(filterName ? filterName : "");
    setErrorText("");
  }, [filterName, canUpdate]);

  const label = newFitler || !canUpdate ? "Create new filter" : "Update filter";

  const inputValue = !newFitler ? (filterName ? filterName : "") : name;

  const _onSubmit = () => {
    if (name.length > 0) {
      onFormSave(newFitler, name);
    } else {
      setErrorText("Need a valid filter name");
    }
  };
  return (
    <form autoComplete="off">
      <div className="formSection">
        <Typography>Save Filters</Typography>
      </div>
      {
        <div className="formSection">
          <FormControl component="fieldset">
            <FormLabel component="legend">Create new filter or update current filter?</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={newFitler}
                    onChange={(e) => setNewFilter(e.target.checked)}
                    name="newFilter"
                  />
                }
                label={label}
                disabled={filterName === undefined || !canUpdate}
              />
            </FormGroup>
          </FormControl>
        </div>
      }
      {
        <div className="formSection">
          <TextField
            name="filterName"
            label="Name"
            value={inputValue}
            disabled={!newFitler}
            onChange={(e) => setName(e.target.value)}
            helperText={errorText}
            error={errorText.length > 0}
          />
        </div>
      }
      <Button style={{ margin: "0 0 24px 24px" }} onClick={_onSubmit}>
        <CheckCircle /> Confirm
      </Button>
      <Button style={{ margin: "0 0 24px 24px" }} onClick={() => onCloseForm()}>
        <Cancel /> Cancel
      </Button>
    </form>
  );
};

export default SaveFilter;
