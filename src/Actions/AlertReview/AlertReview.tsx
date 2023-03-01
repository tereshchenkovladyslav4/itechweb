import React, { useEffect, useState } from "react";
import { useStyles } from "./AlertReview.styles";
import { trackPromise } from "react-promise-tracker";
import { throwError } from "rxjs";
import { useStore } from "../../_context/Store";
import { Box, Button, FormLabel, MenuItem, TextField, Select } from "@mui/material";
import { taskService } from "../../_services/taskService";
import ComponentError from "../../_helpers/ComponentError";
import { iTechDataTaskOutcomeEnum } from "../../Model/iTechRestApi/iTechDataTaskOutcomeEnum";
import {
  MoveSelectedEvent,
  MoveSelectedItemEvent,
  RefreshTableEvent,
  trigger,
  UpdateMenusEvent,
} from "../../_helpers/events";
import { Direction } from "../../Model/Types/Direction";
import { ITechDataSecurityObject } from "../../Model/iTechRestApi/ITechDataSecurityObject";
import UserSearch, { SearchDataType } from "../../Filter/UserSearch";
import { authenticationService } from "../../_services/authenticationService";
import { ITechWebTask } from "../../Model/iTechRestApi/ITechWebTask";
import ActionChips from "../ActionChips/ActionChips";
import clsx from "clsx";
import { toSentence } from "../../_helpers/utilities";

type AlertReviewProps = {
  area?: string;
  disabled?: boolean;
};

const AlertReview: React.FC<AlertReviewProps> = ({ area, disabled = false }): any => {
  const _defaultOutcome = 8;
  const classes = useStyles();
  const { selectors } = useStore();
  const [task, setTask] = useState<ITechWebTask>(new ITechWebTask());
  const [investigator, setInvestigator] = useState<ITechDataSecurityObject | undefined>(
    authenticationService.currentUserValue?.authenticatedUser as ITechDataSecurityObject | undefined
  );

  useEffect(() => {
    const selectedItem = selectors.getSelectedGridRow();
    if (!selectedItem) return;
    taskService.get(selectedItem.rowId).then((t) => {
      if (t.iTechDataTaskOutcomeTypeRowId == null)
        t.iTechDataTaskOutcomeTypeRowId = _defaultOutcome;
      setTask(t);
    });
  }, [selectors.getSelectedGridRow()]);

  const _onActionClick = () => {
    const selectedItem = selectors.getSelectedGridRow();
    if (selectedItem) {
      return trackPromise(
        taskService.escalate(
          selectedItem?.rowId,
          task?.iTechDataTaskOutcomeTypeRowId,
          task?.outcomeNotes ?? "",
          investigator?.rowId
        ),
        area
      ).then(
        () => {
          setTask(new ITechWebTask());
          trigger(UpdateMenusEvent);
          trigger(RefreshTableEvent);
          trigger(MoveSelectedItemEvent, {
            direction: Direction.Down,
          } as MoveSelectedEvent);
        },
        (error) => {
          throwError(new ComponentError(AlertReview.displayName||'', error?.message || error));
        }
      );
    }
  };

  const _handleNotes = (value: any) => {
    setTask((prev) => ({ ...prev, outcomeNotes: value ?? "" }));
  };

  const _handleOutcome = (value: any) => {
    if (value) setTask((prev) => ({ ...prev, iTechDataTaskOutcomeTypeRowId: value as number }));
  };

  const escalted = task?.taskStatusType == "Done" ? classes.confirmed : {};

  const outcomes: iTechDataTaskOutcomeEnum[] = [
    iTechDataTaskOutcomeEnum.escalated,
    iTechDataTaskOutcomeEnum.falseAlarm,
    iTechDataTaskOutcomeEnum.hold,
    iTechDataTaskOutcomeEnum.refer,
  ];

  const setUser = (v: any) => {
    setInvestigator(v);
  };

  return (
    <Box m={1}>
      <ActionChips />
      <Box m={1}>
        <FormLabel component="legend" required className={classes.containerTall}>
          Compliance Analyst
        </FormLabel>
        <UserSearch
          datatype={SearchDataType.SecurityObject}
          value={investigator}
          setValue={setUser}
          isLogin
          style={{ width: "100%" }}
        />
      </Box>
      <Box mb={1} p={2} className={classes.actionBox}>
        <Select
          labelId="outcome"
          onChange={(e) => _handleOutcome(e.target?.value)}
          value={task?.iTechDataTaskOutcomeTypeRowId ?? _defaultOutcome}
        >
          {Object.values(outcomes)
            .filter((value) => typeof value !== "string")
            .map((x) => (
              <MenuItem value={x as number} key={x}>
                {toSentence(iTechDataTaskOutcomeEnum[x as number].toString())}
              </MenuItem>
            ))}
        </Select>
        <div className={classes.containerTall}>
          <TextField
            id="standard-multiline-static"
            label="Reason (required)"
            multiline
            rows={4}
            fullWidth
            value={task?.outcomeNotes ?? ""}
            disabled={disabled}
            onChange={(e) => _handleNotes(e.target.value)}
          />
        </div>
        <Button
          className={clsx(classes.button, escalted)}
          variant="outlined"
          onClick={() => _onActionClick()}
          disabled={task?.outcomeNotes?.length === 0 || investigator == undefined}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

AlertReview.displayName = "AlertReview";

export default AlertReview;
