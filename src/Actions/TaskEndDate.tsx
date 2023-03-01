import { Typography } from "@mui/material";
import { Alert } from '@mui/material';
import moment from "moment";
import React, { ReactElement, useState, useEffect } from "react";
import SelectedGridRowType from "../Model/Types/selectedGridRowType";
import { useStore } from "../_context/Store";
import { taskScheduledEnd, taskScheduledEndString } from "../_helpers/utilities";
import { useStyles } from "./TaskEndDate.styles";

const TaskEndDate: React.FC = (): ReactElement => {
  const [task, setTask] = useState<SelectedGridRowType>();
  const { selectors } = useStore();
  const classes = useStyles();

  useEffect(() => {
    setTask(selectors.getSelectedGridRow());
  }, [selectors.getSelectedGridRow()]);

  const endDate = taskScheduledEndString(task);
  if (endDate.length === 0) <></>;

  const fromNow =
    taskScheduledEnd(task) &&
    taskScheduledEnd(task)?.isAfter(moment()) &&
    ` (${taskScheduledEnd(task)?.fromNow()})`;
  return (
    <Alert severity="warning" className={classes.alert}>
      <Typography variant="caption" className={classes.bold}>
        End
      </Typography>
      : {endDate}
      <Typography variant="caption" className={classes.italic}>
        {fromNow}
      </Typography>
    </Alert>
  );
};

export default TaskEndDate;
