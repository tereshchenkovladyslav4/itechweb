import React, { ReactElement, useEffect, useState } from "react";
import { useStore } from "../_context/Store";
import { iTechDataTaskEnum } from "../Model/iTechRestApi/iTechDataTaskEnum";
import { getEnumKeyByEnumValue } from "../_helpers/helpers";
import { caseService } from "../_services/caseService";
import { reloadCase } from "../_context/thunks/case";
import { unCapitalize } from "../_helpers/utilities";
import { TableEnum } from "../Model/iTechRestApi/TableEnum";
import { iTechDataCaseEnum } from "../Model/iTechRestApi/iTechDataCaseEnum";
import { iTechDataCaseSubEnum } from "../Model/iTechRestApi/iTechDataCaseSubEnum";
import { useStyles } from "./Actions.styles";
import DPIA from "./DPIA/DPIA";
import AlertReview from "./AlertReview/AlertReview";
import SurveillanceReview from "./SurveillanceReview/SurveillanceReview";
import Root from "./Root/Root";
import ObjectReview from "./ObjectReview/ObjectReview";
import ConfirmDeny from "./ConfirmDeny/ConfirmDeny";
import VerificationAcknowledgement from "./VerificationAcknowledgement/VerificationAcknowledgement";
import PrevNext from "./PrevNext/PrevNext";
import SelectDataSources from "./SelectDataSources/SelectDataSources";
import ReadOnly from "./ReadOnly/ReadOnly";
import ReadOnlyCase from "./ReadOnly/ReadOnlyCase";

type ActionsProps = {
  area: string;
};

const Actions: React.FC<ActionsProps> = ({ area }): ReactElement => {
  const { selectors, dispatch } = useStore();
  const classes = useStyles();

  useEffect(() => {
    const caseId = selectors.getSelectedCaseId();

    if (caseId) {
      reloadCase(selectors, caseService.get, dispatch);
    }
  }, []);

  const [taskType, setTaskType] = useState("");

  useEffect(() => {
    const type = selectors.getSelectedGridRow()?.taskType;

    if (type) {
      const camelType = unCapitalize(type);
      const key = getEnumKeyByEnumValue(iTechDataTaskEnum, camelType);
      setTaskType(key);
    }
  }, [selectors.getSelectedGridRow()]);

  const isCaseClosed = selectors.getCaseClosed();

  if (selectors.getSelectedGridRow() == null) {
    return isCaseClosed ? (
      <ReadOnlyCase />
    ) : (
      <div data-testid={"actions-" + selectors.getSelectedCaseId()}>
        <Root area={area} />
      </div>
    );
  }

  const confirmDenyTasks: string[] = [
    iTechDataTaskEnum.agentApproval.toString(),
    iTechDataTaskEnum.susActivityVerification.toString(),
    // iTechDataTaskEnum.notifySupervisor.toString(),
    // iTechDataTaskEnum.notifySarRequestor.toString(),
    // iTechDataTaskEnum.closeWorkflow.toString(),
    // iTechDataTaskEnum.fullyAutoDeletion.toString(),
  ];

  const isDPIA =
    selectors.getSelectedCase()?.iTechDataCaseSubTypeRowId === iTechDataCaseSubEnum.dpia &&
    selectors.getSelectedGridRow()?.args;

  const hideSkipButton =
    isCaseClosed ||
    selectors.getSelectedGridRow()?.datasource !== TableEnum[TableEnum.iTechWebTask];

  const isSurveillance =
    selectors.getSelectedCase()?.iTechDataCaseTypeRowId === iTechDataCaseEnum.surveillance;

  return (
    <div data-testid={"actions-" + selectors.getSelectedCaseId()} className={classes.container}>
      {!isDPIA && <PrevNext hideSkip={hideSkipButton} />}
      {taskType && confirmDenyTasks.includes(taskType) ? (
        <ConfirmDeny area={area} disabled={isCaseClosed} />
      ) : taskType && taskType === iTechDataTaskEnum.form.toString() && isDPIA ? (
        <DPIA area={area} disabled={isCaseClosed} />
      ) : taskType &&
        (taskType === iTechDataTaskEnum.alertReview.toString() ||
          taskType === iTechDataTaskEnum.alertReviewL2.toString()) ? (
        <AlertReview area={area} disabled={isCaseClosed} />
      ) : taskType && taskType === iTechDataTaskEnum.verificationAcknowledgement.toString() ? (
        <VerificationAcknowledgement area={area} disabled={isCaseClosed} />
      ) : taskType && taskType === iTechDataTaskEnum.supervisorReview.toString() ? (
        <Root area={area} />
      ) : taskType &&
        (taskType === iTechDataTaskEnum.objectReviewAutomatic.toString() ||
          taskType === iTechDataTaskEnum.objectReviewManual.toString()) ? (
        isSurveillance ? (
          <SurveillanceReview area={area} disabled={isCaseClosed} />
        ) : (
          <ObjectReview area={area} disabled={isCaseClosed} />
        )
      ) : taskType && taskType === iTechDataTaskEnum.dataSourceSelection.toString() ? (
        <SelectDataSources area={area} disabled={isCaseClosed} />
      ) : (
        <ReadOnly />
      )}
    </div>
  );
};

Actions.displayName = "Actions";

export default Actions;
