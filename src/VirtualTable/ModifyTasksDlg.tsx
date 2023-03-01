import React, { ReactElement, useState, useRef } from "react";
import { Button, Typography, Portal,  MenuItem, FormHelperText } from "@mui/material";
import { FormLabel } from "@mui/material";
import clsx from "clsx";
import { CheckCircle, Cancel } from "@mui/icons-material";
import FormBuilder from "../Form/FormBuilder";
import UserSearch, { SearchDataType } from "../Filter/UserSearch";
import { capitalize, toSentence } from "../_helpers/utilities";
import { QuerySet } from "../Model/Types/QuerySet";
import { useStyles } from "./ModifyTasksDlg.styles";
import useErrors from "../_helpers/hooks/useErrors";
import BusyButton from "../_components/BusyButton";
import { trackPromise } from "react-promise-tracker";
import { ITaskData } from "../Model/iTechRestApi/ITaskData";
import { taskService } from "../_services/taskService";
import { iTechDataTaskStatusEnum } from "../Model/iTechRestApi/iTechDataTaskStatusEnum";
import { RefreshTableEvent, trigger } from "../_helpers/events";
import LabelSelect from "../_components/LabelSelect";

type ModifyTasksProps = {
  onCloseForm: () => void;
  rowIds: number[];
  allChecked: boolean;
  filter?: QuerySet;
};

const ModifyTasks: React.FC<ModifyTasksProps> = ({ onCloseForm, rowIds, allChecked, filter }) => {
  const { hasError, getErrors, clearError, setErrors } = useErrors();
  const [formError, setFormError] = useState<string>("");
  const [taskData, setTaskData] = useState<ITaskData>();
  const classes = useStyles();
  const area = "modifyTaskDlg";

  const updateTasks = () => {
    const submitData = {
      status: taskData?.status,
      owner: taskData?.owner,
      taskFilter: {
        rowIds: rowIds,
        allChecked: allChecked,
        filter: filter,
      },
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
        await trackPromise(taskService.updates(submitData), area).then(() =>
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

  const TaskDetails = () => {
    return (
      <div className={classes.root}>
        <FormHelperText style={{ marginLeft: 30 }} error={formError?.length > 0}>
          {formError}
        </FormHelperText>
        <div className={classes.formSection}>
          <div className={clsx(classes.displayArea, classes.leftPanel, classes.vertical)}>
            <LabelSelect
              value={taskData?.status?.toString() || 0}
              onChange={setValue("status")}
              style={{ minWidth: "100px", marginBottom: 10 }}
              label="Status (Optional)"
            >
              <MenuItem key={0} value={0}>
                Unset
              </MenuItem>
              {Object.keys(iTechDataTaskStatusEnum)
                .filter((x) => isNaN(Number(x)))
                .map((x, i) => (
                  <MenuItem key={i} value={i + 1}>
                    {toSentence(x)}
                  </MenuItem>
                ))}
            </LabelSelect>
            <FormLabel component="legend">Owner (Optional)</FormLabel>
            <UserSearch
              datatype={SearchDataType.SecurityObject}
              value={taskData?.owner ? taskData.owner : ""}
              setValue={setValue("owner")}
              isLogin
              style={{ width: "100%", marginTop: 10 }}
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
        <Typography variant="h4">Task Update</Typography>
        <FormLabel component="legend">Update multiple tasks</FormLabel>
      </div>
      {TaskDetails()}

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

type ModifyTasksDlgProps = {
  show: boolean;
  setShow: (show: boolean) => void;
  rowIds: number[];
  allChecked: boolean;
  filter?: QuerySet;
};

const ModifyTasksDlg: React.FC<ModifyTasksDlgProps> = ({
  show,
  setShow,
  rowIds,
  allChecked,
  filter,
}): ReactElement => {
  const container = useRef();

  return (
    <Portal container={container.current}>
      <FormBuilder propDisplay={show} onChange={setShow}>
        <ModifyTasks
          onCloseForm={() => setShow(false)}
          allChecked={allChecked}
          rowIds={rowIds}
          filter={filter}
        />
      </FormBuilder>
    </Portal>
  );
};

export default ModifyTasksDlg;
