import React, { ReactElement, useEffect, useState } from "react";
import { useStore } from "../../_context/Store";
import { iTechDataTaskEnum } from "../../Model/iTechRestApi/iTechDataTaskEnum";
import SelectedGridRowType from "../../Model/Types/selectedGridRowType";
import { getEnumKeyByEnumValue } from "../../_helpers/helpers";
import { useStyles } from "./ActionChips.styles";
import { Box, Chip } from "@mui/material";
import IconManager from "../../_components/IconManager";
import { unCapitalize } from "../../_helpers/utilities";

const ActionChips: React.FC = (): ReactElement => {
  const classes = useStyles();
  const [task, setTask] = useState<SelectedGridRowType>();
  const { selectors } = useStore();

  useEffect(() => {
    setTask(selectors.getSelectedGridRow());
  }, [selectors.getSelectedGridRow()]);

  const getType = (): string => {
    if (!task || !task.taskType) return "";
    const type = task.taskType;
    const camelType = unCapitalize(type);
    return getEnumKeyByEnumValue(iTechDataTaskEnum, camelType);
  };

  const automatedTasks: string[] = [
    iTechDataTaskEnum.notifySupervisor.toString(),
    iTechDataTaskEnum.notifySarRequestor.toString(),
    iTechDataTaskEnum.requestorResponse.toString(),
    iTechDataTaskEnum.assigningSupervisor.toString(),
    iTechDataTaskEnum.idVerification.toString(),
    iTechDataTaskEnum.redactionExecution.toString(),
    iTechDataTaskEnum.dataDiscoveryAutomatic.toString(),
    iTechDataTaskEnum.objectReviewAutomatic.toString(),
    iTechDataTaskEnum.taskAssignmentAutomatic.toString(),
    iTechDataTaskEnum.sendOutput.toString(),
  ];

  const isAutomated = (): boolean => {
    return automatedTasks.includes(getType());
  };

  const isCompleted = (): boolean => {
    return task?.taskStatusType === "Done";
  };

  const isRoot = (): boolean => {
    return task?.iTechDataTaskRootRowId === task?.rowId;
  };

  const headers: string[] = [
    iTechDataTaskEnum.groupHeader.toString(),
    iTechDataTaskEnum.dataReviewHeader.toString(),
    iTechDataTaskEnum.dataDiscoveryHeader.toString(),
    iTechDataTaskEnum.dataSourceReviewHeader.toString(),
  ];
  const isHeader = (): boolean => {
    return headers.includes(getType());
  };

  const reviewType: string[] = [
    iTechDataTaskEnum.dataDiscoveryManual.toString(),
    iTechDataTaskEnum.objectReviewManual.toString(),
    iTechDataTaskEnum.dataDiscoveryAutomatic.toString(),
    iTechDataTaskEnum.objectReviewAutomatic.toString(),
  ];
  const isReview = (): boolean => {
    return task?.taskStatusType == "Done" && reviewType.includes(getType());
  };
  const reviewSuccess = (): boolean => {
    return (
      task?.outcomeType === "Successful" ||
      task?.outcomeType === "Relevant" ||
      task?.outcomeType == null
    );
  };

  return (
    <div className={classes.chipList}>
      {isReview() && reviewSuccess() && (
        <Box m={1}>
          <Chip
            label="Approved"
            variant="outlined"
            className={classes.approved}
            icon={<IconManager icon="ThumbUp" />}
          />
        </Box>
      )}
      {isReview() && !reviewSuccess() && (
        <Box m={1}>
          <Chip
            label="Not Relevant"
            variant="outlined"
            className={classes.denied}
            icon={<IconManager icon="ThumbDown" />}
          />
        </Box>
      )}
      {isRoot() && (
        <Box m={1}>
          <Chip
            label="Task Root"
            variant="outlined"
            className={classes.root}
            icon={<IconManager icon="AccountTree" />}
          />
        </Box>
      )}
      {isHeader() && (
        <Box m={1}>
          <Chip
            label="Task Group"
            variant="outlined"
            className={classes.groupHeader}
            icon={<IconManager icon="AccountTree" />}
          />
        </Box>
      )}
      {isAutomated() && (
        <Box m={1}>
          <Chip
            label="Automated"
            variant="outlined"
            className={classes.automated}
            icon={<IconManager icon="Autorenew" />}
          />
        </Box>
      )}
      {isCompleted() && (
        <Box m={1}>
          <Chip
            label="Completed"
            variant="outlined"
            className={classes.completed}
            icon={<IconManager icon="Done" />}
          />
        </Box>
      )}
    </div>
  );
};

ActionChips.displayName = "ActionChips";

export default ActionChips;
