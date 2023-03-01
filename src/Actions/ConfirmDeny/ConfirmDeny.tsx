import React, { ReactElement, useEffect, useState } from "react";
import { useStyles } from "./ConfirmDeny.styles";
import { trackPromise } from "react-promise-tracker";
import { throwError } from "rxjs";
import { useStore } from "../../_context/Store";
import { Button, Box } from "@mui/material";
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
import SelectedGridRowType from "../../Model/Types/selectedGridRowType";
import clsx from "clsx";
import { Direction } from "../../Model/Types/Direction";
import ActionChips from "../ActionChips/ActionChips";

type ConfirmDenyProps = {
  area?: string;
  disabled?: boolean;
};

const ConfirmDeny: React.FC<ConfirmDenyProps> = ({ area, disabled = false }): ReactElement => {
  const classes = useStyles();
  const { selectors } = useStore();
  const [task, setTask] = useState<SelectedGridRowType>();

  useEffect(() => {
    setTask(selectors.getSelectedGridRow());
  }, [selectors.getSelectedGridRow()]);

  const _onActionClick = (requestedStatus: iTechDataTaskOutcomeEnum) => {
    const selectedItem = selectors.getSelectedGridRow();
    if (selectedItem) {
      return trackPromise(taskService.confirmDeny(selectedItem?.rowId, requestedStatus), area).then(
        () => {
          trigger(UpdateMenusEvent);
          trigger(RefreshTableEvent);
          trigger(MoveSelectedItemEvent, {
            direction: Direction.Down,
          } as MoveSelectedEvent);
        },
        (error) => {
          throwError(new ComponentError(ConfirmDeny.displayName, error?.message || error));
        }
      );
    }
  };

  const confirmed =
    task?.taskStatusType == "Done" &&
    (task?.outcomeType === "Successful" || task?.outcomeType == null)
      ? classes.confirmed
      : {};
  const denied =
    task?.taskStatusType == "Done" && Object.keys(confirmed).length == 0 ? classes.denied : {};

  return (
    <Box m={2}>
      <ActionChips />
      <Button
        className={clsx(classes.button, confirmed)}
        variant="outlined"
        disabled={disabled}
        onClick={() => _onActionClick(iTechDataTaskOutcomeEnum.successful)}
      >
        Confirm
      </Button>
      <Button
        className={clsx(classes.button, denied)}
        variant="outlined"
        disabled={disabled}
        onClick={() => _onActionClick(iTechDataTaskOutcomeEnum.taskNotRelevant)}
      >
        Deny
      </Button>
    </Box>
  );
};

ConfirmDeny.displayName = "ConfirmDeny";

export default ConfirmDeny;
