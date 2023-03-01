import React, { ReactElement } from "react";
import { useStore } from "../../_context/Store";
import { useStyles } from "./ReadOnly.styles";
import { Box, Table, TableBody, TableCell, TableRow } from "@mui/material";
import { iTechDataCaseStatusEnum } from "../../Model/iTechRestApi/iTechDataCaseStatusEnum";
import { getEnumKeyByEnumValue } from "../../_helpers/helpers";
import { capitalize } from "../../_helpers/utilities";
import { LockOpen } from "@mui/icons-material";
import BusyButton from "../../_components/BusyButton";
import { trackPromise } from "react-promise-tracker";
import { caseService } from "../../_services/caseService";
import { reloadCase } from "../../_context/thunks/case";
import { trigger, UpdateMenusEvent } from "../../_helpers/events";

const ReadOnlyCase: React.FC = (): ReactElement => {
  const classes = useStyles();
  const { selectors, dispatch } = useStore();
  const area = "btnReadOnlyCase";
  const currentCase = selectors.getSelectedCase();

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

  const status = (): string => {
    if (!currentCase) return "";
    const type = getEnumKeyByEnumValue(
      iTechDataCaseStatusEnum,
      currentCase?.iTechDataCaseStatusTypeRowId as iTechDataCaseStatusEnum
    );
    const camelType = capitalize(type);
    return camelType;
  };

  const _onReopenClick = () => {
    if (currentCase) {
      trackPromise(
        caseService.updateStatus(currentCase.rowId, iTechDataCaseStatusEnum.workingOnIt),
        area
      ).then(() => {
        // reload the case
        reloadCase(selectors, caseService.get, dispatch);
        // update menu tree
        trigger(UpdateMenusEvent);
      });
    }
  };

  return (
    <Box m={1} className={classes.header}>
      <Table>
        <TableBody className={classes.tableBody}>
          <Row id="caseName" name="Case" value={currentCase?.name || ""} />
          <Row id="caseReference" name="Reference" value={currentCase?.caseReference || ""} />
          <Row id="caseStatus" name="Status" value={status() || ""} />
          {currentCase?.summary && <Row id="summary" name="Summary" value={currentCase?.summary} />}
          {currentCase?.iTechDataCaseStatusTypeRowId == iTechDataCaseStatusEnum.closed && (
            <Row
              id="reopen"
              value={
                <BusyButton area={area} startIcon={<LockOpen />} onClick={_onReopenClick}>
                  Re-open
                </BusyButton>
              }
            />
          )}
        </TableBody>
      </Table>
    </Box>
  );
};

ReadOnlyCase.displayName = "ReadOnlyCase";

export default ReadOnlyCase;
