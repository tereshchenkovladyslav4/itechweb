import React, { ReactElement, useEffect, useState } from "react";
import { useStyles } from "./DPIA.styles";
import { trackPromise } from "react-promise-tracker";
import { throwError } from "rxjs";
import { useStore } from "../../_context/Store";
import {
  Button,
  Box,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
  Checkbox,
  FormGroup,
  Divider,
} from "@mui/material";
import { taskService } from "../../_services/taskService";
import ComponentError from "../../_helpers/ComponentError";
import {
  RefreshTableEvent,
  trigger,
  UpdateMenusEvent,
} from "../../_helpers/events";
import { ITechDataDpia } from "../../Model/iTechRestApi/ITechDataDpia";
import useErrors from "../../_helpers/hooks/useErrors";
import PartOne from "./PartOne";
import PartTwo from "./PartTwo";
import PartThree from "./PartThree";

type DPIAProps = {
  area?: string;
  disabled?: boolean;
};

interface AlterText {
  display: string;
  helperText?: string;
}

export type FormProps = {
  textField: (
    key: keyof ITechDataDpia,
    display: string,
    helperText?: string,
    rows?: number
  ) => JSX.Element;
  boolean: (
    key: keyof ITechDataDpia,
    display: string,
    flavour?: string,
    helperText?: string,
    labels?: string[]
  ) => JSX.Element;
  radio: (
    key: keyof ITechDataDpia,
    values: string[],
    display: string,
    alter?: AlterText,
    flavour?: string,
    helperText?: string
  ) => JSX.Element;
  checkbox: (
    key: keyof ITechDataDpia,
    display: string,
    values: string[],
    helperText?: string,
    alters?: AlterText[],
    flavour?: string
  ) => JSX.Element;
};

const DPIA: React.FC<DPIAProps> = ({ area, disabled = false }): ReactElement => {
  const classes = useStyles();
  const { selectors } = useStore();
  const selectedItem = selectors.getSelectedGridRow();
  const { hasError, getErrors, setErrors } = useErrors();
  const [dpia, setDpia] = useState<ITechDataDpia>(new ITechDataDpia());

  useEffect(() => {
    // TODO: load DPIA from task.args => iTechDataDpia=1
    if (!selectedItem?.args.includes("iTechDataDpia=")) return;

    const rowId = selectedItem.args.split("=").pop(); // assumes dpia is last param!
    if (rowId && !rowId.includes("null"))
      trackPromise(taskService.getDpia(rowId), area).then((result) => {
        setDpia(result);
        setErrors("");
      });
  }, [selectors.getSelectedGridRow()]);

  const _onChange = (key: keyof ITechDataDpia, value: any) => {
    setDpia((prev) => ({ ...prev, [key]: value }));
  };

  const _renderTextField = (
    key: keyof ITechDataDpia,
    display: string,
    helperText?: string,
    rows = 1
  ) => {
    return (
      <TextField
        margin="normal"
        fullWidth
        id={key}
        label={display}
        value={dpia[key as keyof ITechDataDpia] || ""}
        name={key}
        onChange={(e) => _onChange(key, e.target.value)}
        error={hasError(key)}
        helperText={getErrors(key) ?? helperText}
        className={classes.textField}
        size="small"
        key={key}
        disabled={disabled}
        multiline={rows > 1 || false}
        rows={rows}
      />
    );
  };

  const _renderBoolean = (
    key: keyof ITechDataDpia,
    display: string,
    flavour?: string,
    helperText?: string,
    labels: string[] = ["Yes", "No"]
  ) => {
    return (
      <FormControl>
        <FormLabel id={display} className={classes.formLabel}>
          {display}
        </FormLabel>
        {flavour && <Typography>{flavour}</Typography>}
        <RadioGroup
          row
          aria-labelledby={display}
          name={key}
          value={dpia[key as keyof ITechDataDpia]?.toString() ?? ""}
          defaultValue={dpia[key as keyof ITechDataDpia]?.toString() ?? ""}
          onChange={(e) => _onChange(key, e.target.value === "true")}
        >
          <FormControlLabel
            value="true"
            control={<Radio />}
            label={labels[0]}
            disabled={disabled}
          />
          <FormControlLabel
            value="false"
            control={<Radio />}
            label={labels[1]}
            disabled={disabled}
          />
          {hasError(key) && (
            <FormHelperText className={classes.error}>{getErrors(key)}</FormHelperText>
          )}
          {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </RadioGroup>
      </FormControl>
    );
  };

  const _renderRadio = (
    key: keyof ITechDataDpia,
    values: string[],
    display: string,
    alter?: AlterText,
    flavour?: string,
    helperText?: string
  ) => {
    const currentVal = dpia[key as keyof ITechDataDpia]?.toString() ?? "";
    const _defaultAlt = () => (!values.includes(currentVal) ? currentVal?.toString() : "");
    const [alterVal, setAlterVal] = useState<string>("");
    useEffect(() => {
      if (!currentVal || alterVal?.length > 0) return;
      setAlterVal(_defaultAlt());
    }, [currentVal]);
    const _radioChange = (value: string) => {
      _onChange(key, value);
      setAlterVal("");
    };
    const _textChange = (value: string) => {
      _onChange(key, value);
      setAlterVal(value);
    };
    return (
      <FormControl>
        <FormLabel id={display} className={classes.formLabel}>
          {display}
        </FormLabel>
        {flavour && <Typography>{flavour}</Typography>}
        <RadioGroup
          row
          aria-labelledby={display}
          name={key}
          value={currentVal?.toString() ?? "true"}
          defaultValue={currentVal?.toString() ?? "true"}
          onChange={(e) => _radioChange(e.target.value)}
        >
          {values.map((val) => (
            <FormControlLabel
              value={val}
              control={<Radio />}
              label={val}
              key={val}
              disabled={disabled}
            />
          ))}
          {alter && (
            <TextField
              margin="normal"
              fullWidth
              id={alter.display}
              label={alter.display}
              value={alterVal || ""}
              name={key}
              onChange={(e) => _textChange(e.target.value)}
              helperText={alter.helperText}
              className={classes.textField}
              size="small"
              key={alter.display}
              disabled={disabled}
            />
          )}
          {hasError(key) && (
            <FormHelperText className={classes.error}>{getErrors(key)}</FormHelperText>
          )}
          {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </RadioGroup>
        <Divider />
      </FormControl>
    );
  };

  const _onChangeGroup = (dpiaKey: keyof ITechDataDpia, prop: string, value: any) => {
    const currentProps = dpia[dpiaKey] != undefined ? JSON.parse(dpia[dpiaKey] as string) : {};
    currentProps[prop] = value;
    setDpia((prev) => ({ ...prev, [dpiaKey]: JSON.stringify(currentProps) }));
  };

  const _renderCheckbox = (
    key: keyof ITechDataDpia,
    display: string,
    values: string[],
    helperText?: string,
    alters?: AlterText[],
    flavour?: string
  ) => {
    const _getVal = (prop: string): boolean | undefined => {
      if (!dpia[key]) return undefined;
      const currentProps = JSON.parse(dpia[key] as string);
      return currentProps[prop];
    };
    return (
      <FormControl className={classes.formGroup}>
        <FormLabel id={display} className={classes.formLabel}>
          {display}
        </FormLabel>
        {flavour && <Typography>{flavour}</Typography>}
        <FormGroup style={{ display: "flex", flexDirection: "row" }} row>
          {values.map((val) => (
            <FormControlLabel
              key={val}
              control={
                <Checkbox
                  checked={_getVal(val) || false}
                  defaultChecked={_getVal(val) || false}
                  onChange={(e) => _onChangeGroup(key, val, e.target.checked)}
                  disabled={disabled}
                  key={val}
                  name={val}
                />
              }
              label={val}
            />
          ))}
          <FormGroup row className={classes.helper}>
            {hasError(key) && (
              <FormHelperText className={classes.error}>{getErrors(key)}</FormHelperText>
            )}
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
          </FormGroup>
          {alters?.map((alter) => (
            <TextField
              margin="normal"
              fullWidth
              id={alter.display}
              label={alter.display}
              value={_getVal(alter.display) || ""}
              name={key}
              onChange={(e) => _onChangeGroup(key, alter.display, e.target.value)}
              helperText={alter.helperText}
              className={classes.textField}
              size="small"
              key={alter.display}
              disabled={disabled}
            />
          ))}
        </FormGroup>
        <Divider />
      </FormControl>
    );
  };

  const _onActionClick = () => {
    if (selectedItem) {
      return trackPromise(taskService.dpia(selectedItem?.rowId, dpia), area).then(
        () => {
          trigger(UpdateMenusEvent);
          trigger(RefreshTableEvent);
          setErrors("");
        },
        (error) => {
          throwError(new ComponentError(DPIA.displayName, error?.message || error));
          setErrors(error);
        }
      );
    }
  };

  const parts = [
    {
      key: "formId=1",
      value: (
        <PartOne
          textField={_renderTextField}
          boolean={_renderBoolean}
          radio={_renderRadio}
          checkbox={_renderCheckbox}
          key={1}
        />
      ),
    },
    {
      key: "formId=2",
      value: (
        <PartTwo
          textField={_renderTextField}
          boolean={_renderBoolean}
          radio={_renderRadio}
          checkbox={_renderCheckbox}
          key={2}
        />
      ),
    },
    {
      key: "formId=3",
      value: (
        <PartThree
          textField={_renderTextField}
          boolean={_renderBoolean}
          radio={_renderRadio}
          checkbox={_renderCheckbox}
          key={3}
        />
      ),
    },
  ];

  return (
    <Box m={2}>
      <Typography className={classes.header}>
        Persons responsible for the design, development, implementation or changing a new system or
        process must adhere to the UK GDPR data protection principles (see the GDPR Policy section
        “Adherence to Principles”) and must ensure that GL UK&amp;I can facilitate the rights of the
        data subject (see GDPR Policy section “Data Subject Rights”).
      </Typography>
      {parts.map((part) => selectedItem?.args.includes(part.key) && part.value)}
      <Button
        className={classes.button}
        variant="outlined"
        disabled={disabled}
        onClick={_onActionClick}
      >
        Submit
      </Button>
    </Box>
  );
};

DPIA.displayName = "DPIA";

export default DPIA;
