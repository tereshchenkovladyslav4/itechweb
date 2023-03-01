import React, { ReactElement, useEffect, useState } from "react";
import { useStyles } from "./Root.styles";
import { trackPromise } from "react-promise-tracker";
import { throwError } from "rxjs";
import { useStore } from "../../_context/Store";
import { Button, Box, TextField } from "@mui/material";
import ComponentError from "../../_helpers/ComponentError";
import { taskService } from "../../_services/taskService";
import { RefreshTableEvent, trigger, UpdateMenusEvent } from "../../_helpers/events";
import { iTechDataCaseStatusEnum } from "../../Model/iTechRestApi/iTechDataCaseStatusEnum";
import ReadOnlyCase from "../ReadOnly/ReadOnlyCase";
import { caseService } from "../../_services/caseService";
import { getCase, reloadCase } from "../../_context/thunks/case";
import { iTechDataCaseOutcomeEnum } from "../../Model/iTechRestApi/iTechDataCaseOutcomeEnum";
import { Alert } from '@mui/material';

type RootProps = {
  area?: string;
};

const Root: React.FC<RootProps> = ({ area }): ReactElement => {
  const classes = useStyles();
  const { selectors, dispatch } = useStore();
  const [error, setError] = useState("");
  const [outstandingTaskCount, setOutstandingTaskCount] = useState(-1);
  const [showNoteField, setShowNoteField] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    const caseId = selectors.getSelectedCaseId();

    if (caseId) {
      getCase(selectors, caseService.get, dispatch);

      // get count of outstanding tasks for this case
      caseService.getTasksOutstanding(caseId).then((count) => setOutstandingTaskCount(count));
    }
  }, []);

  const _onActionClick = (status: iTechDataCaseStatusEnum, outcome: iTechDataCaseOutcomeEnum) => {
    return trackPromise(taskService.complete(status, outcome, note), area).then(
      () => {
        setShowNoteField(false);
        setNote("");
        reloadCase(selectors, caseService.get, dispatch);
        trigger(UpdateMenusEvent); // more granular would be to - implement CaseChangedEventType to just reload case / menu for case
        trigger(RefreshTableEvent);
        setError("");
      },
      (error) => {
        setError(error);
        throwError(new ComponentError(Root.displayName, error?.message || error));
      }
    );
  };

  const _onDenyClick = () => {
    setShowNoteField(true);
  };

  const _onBackClick = () => {
    setShowNoteField(false);
    setNote("");
  };

  const currentCase = selectors.getSelectedCase();

  return (
    <>
      {error.length > 0 && (
        <Box m={2} style={{ color: "Red" }}>
          {error}
        </Box>
      )}
      {currentCase?.iTechDataCaseStatusTypeRowId === iTechDataCaseStatusEnum.closed && (
        <ReadOnlyCase />
      )}
      {currentCase?.iTechDataCaseStatusTypeRowId !== iTechDataCaseStatusEnum.closed && (
        <Box m={2}>
          {outstandingTaskCount > 0 && (
            <Alert severity="info" style={{ marginBottom: 10 }}>
              Outstanding tasks: {outstandingTaskCount}. All tasks must be completed to approve /
              deny a case.
            </Alert>
          )}
          {!showNoteField && (
            <>
              <Button
                className={classes.button}
                color="secondary"
                disabled={outstandingTaskCount !== 0}
                onClick={() =>
                  _onActionClick(
                    iTechDataCaseStatusEnum.closed,
                    iTechDataCaseOutcomeEnum.successful
                  )
                }
              >
                Approve Case
              </Button>
              <Button
                className={classes.button}
                color="secondary"
                disabled={outstandingTaskCount !== 0}
                onClick={_onDenyClick}
              >
                Deny Case
              </Button>
              <Button
                className={classes.button}
                color="secondary"
                onClick={() =>
                  _onActionClick(iTechDataCaseStatusEnum.onHold, iTechDataCaseOutcomeEnum.noCase)
                }
              >
                Hold Case
              </Button>
            </>
          )}
          {showNoteField && (
            <>
              <TextField
                multiline
                fullWidth
                className={classes.text}
                label="Reason"
                rows={8}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <Button
                variant="outlined"
                className={classes.button}
                disabled={outstandingTaskCount !== 0}
                onClick={() =>
                  _onActionClick(iTechDataCaseStatusEnum.closed, iTechDataCaseOutcomeEnum.rejected)
                }
              >
                Deny Case
              </Button>
              <Button variant="outlined" className={classes.button} onClick={_onBackClick}>
                Back
              </Button>
            </>
          )}
        </Box>
      )}
    </>
  );
};

Root.displayName = "Root";

export default Root;
