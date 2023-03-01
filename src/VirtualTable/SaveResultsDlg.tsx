import React, { ReactElement, useEffect, useState, useRef } from "react";
import { Button, Typography, Switch, Portal } from "@mui/material";
import { FormLabel, FormControl, FormGroup, FormControlLabel, TextField } from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import FormBuilder from "../Form/FormBuilder";
import BusyButton from "../_components/BusyButton";

type SaveResultsProps = {
  resultsName?: string;
  onFormSave: (newResultSet: boolean, name: string) => void;
  onCloseForm: () => void;
  canUpdate: boolean; // true only if current user created results set
};

export const saveResultsDlgArea = "saveResutsDlg";

const SaveResults: React.FC<SaveResultsProps> = ({
  resultsName,
  onFormSave,
  onCloseForm,
  canUpdate,
}) => {
  const [newSet, setNewSet] = useState(true);
  const [name, setName] = useState("");
  const [errorText, setErrorText] = useState("");
  const label = newSet || !canUpdate ? "Create new result set" : "Update result set";

  const inputValue = !newSet ? (resultsName ? resultsName : "") : name;

  useEffect(() => {
    setNewSet(resultsName === undefined || !canUpdate);
    setName(resultsName ? resultsName : "");
    setErrorText("");
  }, [resultsName, canUpdate]);

  const _onSubmit = () => {
    if (name.length > 0) {
      onFormSave(newSet, name);
    } else {
      setErrorText("Need a valid result set name");
    }
  };

  return (
    <form autoComplete="off">
      <div className="formSection">
        <Typography>Save Results</Typography>
      </div>
      <div className="formSection">
        <FormControl component="fieldset">
          <FormLabel component="legend">Create new result set or update current results?</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={newSet}
                  onChange={(e) => setNewSet(e.target.checked)}
                  name="newSet"
                />
              }
              label={label}
              disabled={resultsName === undefined || !canUpdate}
            />
          </FormGroup>
        </FormControl>
      </div>
      <div className="formSection">
        <TextField
          required
          name="resultSetName"
          label="Name"
          value={inputValue}
          disabled={!newSet}
          onChange={(e) => setName(e.target.value)}
          helperText={errorText}
          error={errorText.length > 0}
        />
      </div>
      <BusyButton
        style={{ margin: "0 0 24px 24px" }}
        onClick={_onSubmit}
        area={saveResultsDlgArea}
        startIcon={<CheckCircle />}
      >
        Confirm
      </BusyButton>
      <Button
        style={{ margin: "0 0 24px 24px" }}
        onClick={() => onCloseForm()}
        startIcon={<Cancel />}
      >
        Cancel
      </Button>
    </form>
  );
};

type SaveResultsDlgProps = {
  text: string | undefined;
  show: boolean;
  setShow: (show: boolean) => void;
  onSave: (isNew: boolean, name: string) => void;
  canUpdate: boolean;
};

const SaveResultsDlg: React.FC<SaveResultsDlgProps> = ({
  text,
  show,
  setShow,
  onSave,
  canUpdate,
}): ReactElement => {
  const container = useRef();

  return (
    <Portal container={container.current}>
      <FormBuilder propDisplay={show} onChange={setShow}>
        <SaveResults
          onFormSave={onSave}
          onCloseForm={() => setShow(false)}
          resultsName={text}
          canUpdate={canUpdate}
        />
      </FormBuilder>
    </Portal>
  );
};

export default SaveResultsDlg;
