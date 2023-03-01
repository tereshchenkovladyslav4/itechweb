import React, { ReactElement, useEffect, useState } from "react";
import { useStore } from "../../_context/Store";
import SelectedGridRowType from "../../Model/Types/selectedGridRowType";
import { useStyles } from "./ReadOnly.styles";
import { Box, Table, TableBody, TableCell, TableRow } from "@mui/material";
import ActionChips from "../ActionChips/ActionChips";
import { taskScheduledEnd, taskScheduledEndString } from "../../_helpers/utilities";

const ReadOnly: React.FC = (): ReactElement => {
  const classes = useStyles();
  const [task, setTask] = useState<SelectedGridRowType>();
  const { selectors } = useStore();

  useEffect(() => {
    setTask(selectors.getSelectedGridRow());
  }, [selectors.getSelectedGridRow()]);

  const Row = (props: any): React.ReactElement => {
    const { id, name, value } = props;
    return (
      <TableRow key={id} className={classes.tableRow}>
        <TableCell className={classes.tableCell} component="th" scope="row">
          {name}
        </TableCell>
        <TableCell className={classes.tableCell} align="right">
          {value}
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Box m={1} className={classes.header}>
      <ActionChips />

      <Table>
        <TableBody className={classes.tableBody}>
          <Row id="taskName" name="Task" value={task?.taskName || ""} />
          <Row id="taskTypeDescription" name="Type" value={task?.taskTypeDescription || ""} />
          <Row
            id="taskStatusTypeDescription"
            name="Status"
            value={task?.taskStatusTypeDescription || ""}
          />
          <Row id="dateStartActualString" name="Start" value={task?.dateStartActualString || ""} />
          {taskScheduledEnd(task) !== undefined && (
            <Row id="endDate" name="Scheduled End" value={taskScheduledEndString(task)} />
          )}
        </TableBody>
      </Table>
    </Box>
  );
};

ReadOnly.displayName = "ReadOnly";

export default ReadOnly;
