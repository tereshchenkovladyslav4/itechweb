import React, { ReactElement, useState, useRef } from "react";
import { Button, Typography, Portal, FormHelperText } from "@mui/material";
import { FormLabel } from "@mui/material";
import clsx from "clsx";
import { CheckCircle, Cancel } from "@mui/icons-material";
import FormBuilder from "../Form/FormBuilder";
import UserSearch, { SearchDataType } from "../Filter/UserSearch";
import { capitalize } from "../_helpers/utilities";
import { useStyles } from "./ModifyTasksDlg.styles";
import useErrors from "../_helpers/hooks/useErrors";
import BusyButton from "../_components/BusyButton";
import { trackPromise } from "react-promise-tracker";
import { ITaskData } from "../Model/iTechRestApi/ITaskData";
import { taskService } from "../_services/taskService";
import { RefreshTableEvent, trigger } from "../_helpers/events";

type ModifyTaskOwnerProps = {
  onCloseForm: () => void;
};

const ModifyTaskOwner: React.FC<ModifyTaskOwnerProps> = ({ onCloseForm }) => {
  const { hasError, getErrors, clearError, setErrors } = useErrors();
  const [formError, setFormError] = useState<string>("");
  const [taskData, setTaskData] = useState<ITaskData>();
  const classes = useStyles();
  const area = "modifyTaskOwnerDlg";

  const updateTasks = () => {
    const submitData = {
      owner: taskData?.owner,
    } as ITaskData;

    function handleError(e: any) {
      if (typeof e === "object") {
        setErrors(e);
      } else {
        // handle simple string error
        setFormError(`An error occurred: (${e})`);
      }
    }

    if (
      (submitData.status === undefined || submitData.status.toString() === "0") &&
      Object.keys(submitData.owner).length === 0
    ) {
      setFormError("No data submitted");
      return;
    }

    (async () => {
      try {
        await trackPromise(taskService.owner(submitData), area).then(() =>
          trigger(RefreshTableEvent)
        );
        setErrors({});
        onCloseForm();
        setTaskData(undefined);
      } catch (e) {
        handleError(e);
      }
    })();
  };

  const _onSubmit = () => {
    setFormError("");
    setErrors({});
    updateTasks();
  };

  const setValue = (key: keyof ITaskData) => {
    return (e: any) => {
      const val = (
        e.target?.checked !== undefined && e.target.type === "checkbox"
          ? e.target.checked
          : e.target?.value !== undefined
          ? e.target.value
          : e
      ) as never;
      const update = { ...taskData, [key]: val } as ITaskData;
      setTaskData(update);
      // Model errors are keyed off the full model name from server..
      clearError("ITaskData." + capitalize(key));
      setFormError("");
    };
  };

  const FormDisplay = () => {
    return (
      <div className={classes.root}>
        <FormHelperText style={{ marginLeft: 30 }} error={formError?.length > 0}>
          {formError}
        </FormHelperText>
        <div className={classes.formSection}>
          <div className={clsx(classes.displayArea, classes.leftPanel, classes.vertical)}>
            <FormLabel component="legend" style={{ marginBottom: 10 }}>
              Owner
            </FormLabel>
            <UserSearch
              datatype={SearchDataType.SecurityObject}
              value={taskData?.owner ? taskData.owner : ""}
              setValue={setValue("owner")}
              isLogin
              style={{ width: "100%" }}
            />
            <FormHelperText style={{ marginBottom: 5 }} error={hasError("ITaskData.owner")}>
              {getErrors("ITaskData.owner")}
            </FormHelperText>
          </div>
        </div>
      </div>
    );
  };

  return (
    <form autoComplete="off">
      <div className={classes.header}>
        <Typography variant="h4">Owner Update</Typography>
        <FormLabel component="legend">
          Set new owner / investigator for all tasks in this case
        </FormLabel>
      </div>
      {FormDisplay()}

      <div className={classes.clear}>
        <BusyButton
          className={classes.formButton}
          onClick={_onSubmit}
          area={area}
          startIcon={<CheckCircle />}
        >
          Confirm
        </BusyButton>
        <Button
          className={classes.formButton}
          onClick={() => {
            setErrors({});
            onCloseForm();
            setTaskData(undefined);
          }}
          startIcon={<Cancel />}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

type ModifyTaskOwnerDlgProps = {
  show: boolean;
  setShow: (show: boolean) => void;
};

const ModifyTaskOwnerDlg: React.FC<ModifyTaskOwnerDlgProps> = ({ show, setShow }): ReactElement => {
  const container = useRef();

  return (
    <Portal container={container.current}>
      <FormBuilder propDisplay={show} onChange={setShow}>
        <ModifyTaskOwner onCloseForm={() => setShow(false)} />
      </FormBuilder>
    </Portal>
  );
};

export default ModifyTaskOwnerDlg;
