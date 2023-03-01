import React, { ReactElement, useState, useRef, useEffect } from "react";
import { Button, Typography, Portal, FormLabel, Select, MenuItem } from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import FormBuilder from "../Form/FormBuilder";
import { Alert } from '@mui/material';
import { ITechWebAlert } from "../Model/iTechRestApi/ITechWebAlert";
import { iTechDataOutcomeEnum } from "../Model/iTechRestApi/iTechDataOutcomeEnum";
import { alertService } from "../_services/alertService";
import { toSentence } from "../_helpers/utilities";

type EditAlertProps = {
  onFormSave: (alert: ITechWebAlert) => Promise<void | never>;
  onCloseForm: () => void;
  show: boolean;
  gid: string | number | undefined;
};

const EditAlert: React.FC<EditAlertProps> = ({ onFormSave, onCloseForm, show, gid }) => {
  const [alert, setAlert] = useState<ITechWebAlert | undefined>();
  const [errorText, setErrorText] = useState("");

  const _onSubmit = () => {
    if (!alert) setErrorText("No alert selected");
    else {
      onFormSave(alert).then(
        () => {
          setAlert(undefined);
          setErrorText("");
        },
        (error) => setErrorText(error)
      );
    }
  };

  useEffect(() => {
    setErrorText("");

    if (!show || gid === undefined) {
      setAlert(undefined);
      return;
    }

    _load(gid);
  }, [show]);

  useEffect(() => {
    if (gid === undefined) return;

    _load(gid);
  }, [gid]);

  const _load = (gid: string | number) => {
    (async () => {
      await alertService.get(gid).then((result) => {
        setAlert(result);
      });
    })();
  };

  const _setValue = (key: keyof ITechWebAlert) => {
    return (e: any) => {
      const val = (
        e.target?.checked !== undefined && e.target.type === "checkbox"
          ? e.target.checked
          : e.target?.value !== undefined
          ? e.target.value
          : e
      ) as never;
      setAlert((prev) => ({ ...prev, [key]: val } as ITechWebAlert));
    };
  };

  return (
    <>
      <div className="formSection">
        <Typography>Manage Alert</Typography>
        {errorText?.length > 0 && <Alert severity="error">{errorText}</Alert>}
      </div>
      <div className="formSection">
        <FormLabel component="legend">Status</FormLabel>
        <Select
          value={
            alert?.iTechDataOutcomeTypeRowId?.toString() ??
            iTechDataOutcomeEnum.notDefined.toString()
          }
          onChange={_setValue("iTechDataOutcomeTypeRowId")}
          style={{ minWidth: "100px" }}
        >
          {Object.keys(iTechDataOutcomeEnum)
            .filter((x) => isNaN(Number(x)))
            .map((x, i) => (
              <MenuItem key={i} value={i + 1}>
                {toSentence(x)}
              </MenuItem>
            ))}
        </Select>
      </div>
      <Button
        variant="contained"
        color="primary"
        style={{ margin: "0 0 24px 24px" }}
        onClick={_onSubmit}
      >
        <CheckCircle /> Confirm
      </Button>
      <Button
        variant="contained"
        color="primary"
        style={{ margin: "0 0 24px 24px" }}
        onClick={() => onCloseForm()}
      >
        <Cancel /> Cancel
      </Button>
    </>
  );
};

type EditAlertDlgProps = {
  show: boolean;
  setShow: (show: boolean) => void;
  onSave: (group: ITechWebAlert) => Promise<void | never>;
  gid: string | number | undefined;
};

const EditAlertDlg: React.FC<EditAlertDlgProps> = ({
  show,
  setShow,
  onSave,
  gid,
}): ReactElement => {
  const container = useRef();

  return (
    <Portal container={container.current}>
      <FormBuilder propDisplay={show} onChange={setShow}>
        <EditAlert onFormSave={onSave} onCloseForm={() => setShow(false)} show={show} gid={gid} />
      </FormBuilder>
    </Portal>
  );
};

export default EditAlertDlg;
