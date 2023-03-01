import React, { ReactElement, useState, useRef } from "react";
import {
  Button,
  Typography,
  Portal,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { TextField } from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import FormBuilder from "../Form/FormBuilder";
import { ITechDataTerm } from "../Model/iTechRestApi/ITechDataTerm";
import { iTechDataFilterEnum } from "../Model/iTechRestApi/iTechDataFilterEnum";
import { capitalize } from "../_helpers/utilities";
import { iTechDataTermEnum } from "../Model/iTechRestApi/iTechDataTermEnum";

type AddTermProps = {
  onFormSave: (term: ITechDataTerm) => Promise<void>;
  onCloseForm: () => void;
};

const AddTerm: React.FC<AddTermProps> = ({ onFormSave, onCloseForm }) => {
  const _defaultTerm = () => {
    const term = new ITechDataTerm();
    term.term = "";
    term.iTechDataFilterTypeRowId = iTechDataFilterEnum.exact;
    term.iTechDataTermTypeRowId = iTechDataTermEnum.adHoc;
    term.addToAllCases = false;
    return term;
  };
  const [term, setTerm] = useState(_defaultTerm());
  const [errorText, setErrorText] = useState("");

  const _onClose = () => {
    setErrorText("");
    onCloseForm();
  };

  const _onSubmit = () => {
    if (term.term?.length > 0) {
      onFormSave(term).catch((err) => {
        const errorMessage = err["Term"] || err;
        setErrorText(errorMessage);
      });
      setTerm(_defaultTerm());
    } else {
      setErrorText("Need a valid term");
    }
  };

  const setValue = (key: keyof ITechDataTerm) => {
    return (e: any) => {
      const val = (
        e.target?.checked !== undefined && e.target.type === "checkbox"
          ? e.target.checked
          : e.target?.value !== undefined
          ? e.target.value
          : e
      ) as never;
      setTerm((prev) => {
        const term = { ...prev };
        term[key] = val;
        return term;
      });
    };
  };

  return (
    <form autoComplete="off">
      <div className="formSection">
        <Typography>Create Term</Typography>
      </div>
      <div className="formSection">
        <TextField
          name="term"
          label="Term"
          value={term.term ?? ""}
          onChange={setValue("term")}
          helperText={errorText}
          error={errorText.length > 0}
        />
        <Select
          value={term.iTechDataFilterTypeRowId ?? iTechDataFilterEnum.exact}
          onChange={(e) =>
            setTerm((prev) => ({
              ...prev,
              iTechDataFilterTypeRowId: e.target.value as number,
            }))
          }
          style={{ minWidth: "100px", margin: "0 0 0 10px" }}
        >
          {Object.keys(iTechDataFilterEnum)
            .filter((x) => isNaN(Number(x)))
            .map((x, i) => (
              <MenuItem key={i} value={i + 1}>
                {capitalize(x)}
              </MenuItem>
            ))}
        </Select>
        <Select
          value={term.iTechDataTermTypeRowId ?? iTechDataTermEnum.adHoc}
          onChange={(e) =>
            setTerm((prev) => ({
              ...prev,
              iTechDataTermTypeRowId: e.target.value as number,
            }))
          }
          style={{ minWidth: "100px", margin: "0 0 0 10px" }}
        >
          {Object.keys(iTechDataTermEnum)
            .filter((x) => isNaN(Number(x)))
            .map((x, i) => (
              <MenuItem key={i} value={i + 1}>
                {capitalize(x)}
              </MenuItem>
            ))}
        </Select>

        <FormControlLabel
          control={
            <Switch
              checked={term.addToAllCases ?? false}
              onChange={(e) =>
                setTerm((prev) => ({
                  ...prev,
                  addToAllCases: e.target.checked,
                }))
              }
              name="addToAllCases"
            />
          }
          label={"Add to new cases"}
          style={{ marginLeft: 10 }}
        />
      </div>
      <Button style={{ margin: "0 0 24px 24px" }} onClick={_onSubmit}>
        <CheckCircle /> Confirm
      </Button>
      <Button style={{ margin: "0 0 24px 24px" }} onClick={_onClose}>
        <Cancel /> Cancel
      </Button>
    </form>
  );
};

type AddTermDlgProps = {
  show: boolean;
  setShow: (show: boolean) => void;
  onSave: (term: ITechDataTerm) => Promise<void>;
};

const AddTermDlg: React.FC<AddTermDlgProps> = ({ show, setShow, onSave }): ReactElement => {
  const container = useRef();

  return (
    <Portal container={container.current}>
      <FormBuilder propDisplay={show} onChange={setShow}>
        <AddTerm onFormSave={onSave} onCloseForm={() => setShow(false)} />
      </FormBuilder>
    </Portal>
  );
};

export default AddTermDlg;
