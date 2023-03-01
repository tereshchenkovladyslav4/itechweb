import React, { ReactElement, useEffect, useState } from "react";
import { useStyles } from "./ObjectReview.styles";
import { trackPromise } from "react-promise-tracker";
import { throwError } from "rxjs";
import clsx from "clsx";
import { useStore } from "../../_context/Store";
import { Button, Box, TextField, Checkbox } from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Direction } from "../../Model/Types/Direction";
import { CaseAction } from "../../Model/Types/CaseAction";
import { iTechDataTaskOutcomeEnum } from "../../Model/iTechRestApi/iTechDataTaskOutcomeEnum";
import { taskService } from "../../_services/taskService";
import {
  MoveSelectedEvent,
  MoveSelectedItemEvent,
  RefreshTableEvent,
  trigger,
} from "../../_helpers/events";
import ComponentError from "../../_helpers/ComponentError";
import { getCase } from "../../_context/thunks/case";
import { caseService } from "../../_services/caseService";
import { iTechDataCaseSubEnum } from "../../Model/iTechRestApi/iTechDataCaseSubEnum";
import ActionChips from "../ActionChips/ActionChips";
import SelectedGridRowType from "../../Model/Types/selectedGridRowType";
import TaskEndDate from "../TaskEndDate";

type ObjectReviewProps = {
  area?: string;
  disabled?: boolean;
};

const ObjectReview: React.FC<ObjectReviewProps> = ({ area, disabled = false }): ReactElement => {
  const classes = useStyles();
  const [task, setTask] = useState<SelectedGridRowType>();
  const [reason, setReason] = useState("");
  const { selectors, dispatch } = useStore();

  useEffect(() => {
    setTask(selectors.getSelectedGridRow());
    setReason(selectors.getSelectedGridRow()?.outcomeNotes || "");
  }, [selectors.getSelectedGridRow()]);

  const handleChange = (event: any) => {
    setReason(event.target.value);
  };

  useEffect(() => {
    // get or clear selected case
    getCase(selectors, caseService.get, dispatch);
  }, [selectors.getSelectedCaseId()]);

  const isDeletion = () => {
    return (
      selectors.getSelectedCase()?.iTechDataCaseSubTypeRowId === iTechDataCaseSubEnum.art17_Erasure
    );
  };

  const [checked, setChecked] = useState({
    auto: true,
    update: true,
  });

  const _onActionClick = (caseAction: CaseAction) => {
    const selectedItem = task;

    if (selectedItem) {
      let requestedOutcome: iTechDataTaskOutcomeEnum = iTechDataTaskOutcomeEnum.successful;

      switch (caseAction) {
        case CaseAction.Yes:
          requestedOutcome = iTechDataTaskOutcomeEnum.successful;
          break;
        case CaseAction.No:
          requestedOutcome = isDeletion()
            ? iTechDataTaskOutcomeEnum.cannotDelete
            : iTechDataTaskOutcomeEnum.taskNotRelevant;
          break;
        default:
          break;
      }

      return trackPromise(
        taskService.review(selectedItem?.rowId, requestedOutcome, reason),
        area
      ).then(
        () => {
          setReason("");
          if (checked.update) {
            trigger(RefreshTableEvent);
          }

          if (checked.auto) {
            _onDirectionClick(Direction.Down);
          }
        },
        (error) => {
          throwError(new ComponentError(ObjectReview.displayName, error?.message || error));
        }
      );
    }
  };

  const _onDirectionClick = (direction: Direction) => {
    trigger(MoveSelectedItemEvent, {
      direction: direction,
    } as MoveSelectedEvent);
  };

  const _handleCheckedChange = (event: any) => {
    setChecked({ ...checked, [event.target.name]: event.target.checked });
  };

  const approved =
    task?.taskStatusType == "Done" &&
    (task?.outcomeType === "Successful" || task?.outcomeType == null)
      ? classes.approved
      : {};

  return (
    <Box m={1}>
      <ActionChips />
      <TaskEndDate />
      <Box mb={1}>
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                className={classes.checkbox}
                checked={checked.auto}
                onChange={_handleCheckedChange}
                name="auto"
                disabled={disabled}
              />
            }
            label="Auto Move"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={checked.update}
                onChange={_handleCheckedChange}
                name="update"
                disabled={disabled}
              />
            }
            label="Refresh Table"
          />
        </FormGroup>
      </Box>

      <Box mb={1}>
        <Button
          className={clsx(classes.button, approved)}
          variant="outlined"
          disabled={disabled}
          onClick={() => _onActionClick(CaseAction.Yes)}
        >
          {isDeletion() ? "Can be deleted" : "Approved"}
        </Button>
      </Box>

      <Box mb={1} p={2} className={classes.actionBox}>
        <div className={clsx(classes.button, classes.containerTall)}>
          <TextField
            id="standard-multiline-static"
            label="Reason"
            multiline
            rows={4}
            fullWidth
            value={reason}
            disabled={disabled}
            onChange={handleChange}
          />
        </div>
        <Button
          className={clsx(classes.button, classes.denied)}
          variant="outlined"
          disabled={disabled || !reason}
          onClick={() => _onActionClick(CaseAction.No)}
        >
          {isDeletion() ? "Cannot delete" : "Not relevant"}
        </Button>
      </Box>
    </Box>
  );
};

ObjectReview.displayName = "ObjectReview";

export default ObjectReview;
