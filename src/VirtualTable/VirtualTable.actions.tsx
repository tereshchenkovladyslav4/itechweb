import React from "react";
import { MenuAction } from "../Menu/MenuFunction";
import { iTechControlCaseFileStatusEnum } from "../Model/iTechRestApi/iTechControlCaseFileStatusEnum";
import IconManager from "../_components/IconManager";

export enum TableActionId {
  saveResults = 1,
  addToCase,
  addTerm,
  addTermToCase,
  removeTerm,
  deleteTerm,
  modifyTaskOwner,
  modifyTask,
  fileUpload,
  assignCaseFile,
  unassignCaseFile,
  discardCaseFile,
  addLexicon,
  removeLexicon,
  editReportConfiguration,
  removeReportConfiguration,
  removeSelectedReportConfiguration,
  addAlert,
  addToCaseFilter,
  addLexiconGroup,
  addToLexiconGroup,
  addDpiaV2,
  addRopa,
  addRopaMapping,
}

export enum DialogType {
  none,
  fileUpload,
  saveResults,
  addCase,
  modifyTask,
  modifyTaskOwner,
  addTerm,
  addRule,
  editRule,
  confirmRuleAction,
  removeRule,
  removeSelectedRule,
  addSurveillance,
  editSurveillance,
  removeSurveillance,
  removeSelectedSurveillance,
  addLexicon,
  editLexicon,
  removeLexicon,
  removeSelectedLexicon,
  editReportConfiguration,
  removeReportConfiguration,
  removeSelectedReportConfiguration,
  addAlert,
  addToCaseFilter,
  addGroup,
  editGroup,
  removeGroup,
  addSelectedToGroup,
  removeSelectedFromGroup,
  editUser,
  manageLexiconGroup,
  addToLexiconGroup,
  editAlert,
  deleteTerms,
  adminAddUser,
  adminEditUser,
  adminAddSecurityObject,
  adminEditSecurityObject,
  adminArchiveUser,
  adminArchiveSecurityObject,
  adminResetPassword,
  addDpiaV2,
  addRopa,
  addRopaMapping,
}

export interface IActions {
  dataSource: string;
  rowsSelected: number;
  allChecked: boolean;
  caseId: number | undefined;
  setcaseFileStatus: (status: iTechControlCaseFileStatusEnum) => void;
  setShowDialog: (dlg: DialogType) => void;
  dispatch: React.Dispatch<any>;
}

// OBSOLETE
export const createActions = ({ dataSource, setcaseFileStatus }: IActions): MenuAction[] => {
  const tableActions: MenuAction[] = [];

  if (dataSource?.endsWith("WebSimCaseFile")) {
    tableActions.push({
      icon: (
        <IconManager
          fontSize="small"
          icon="AssignmentInd"
          onClick={() => setcaseFileStatus(iTechControlCaseFileStatusEnum.assigned)}
        />
      ),
      name: "Set case file status to assigned ",
      id: TableActionId.assignCaseFile,
      toolTipPlacement: "left-end",
    });
    tableActions.push({
      icon: (
        <IconManager
          fontSize="small"
          icon="AssignmentLate"
          onClick={() => setcaseFileStatus(iTechControlCaseFileStatusEnum.unassigned)}
        />
      ),
      name: "Set case file status to unassigned ",
      id: TableActionId.unassignCaseFile,
      toolTipPlacement: "left-end",
    });
    tableActions.push({
      icon: (
        <IconManager
          fontSize="small"
          icon="Delete"
          onClick={() => setcaseFileStatus(iTechControlCaseFileStatusEnum.discarded)}
        />
      ),
      name: "Set case file status to discarded ",
      id: TableActionId.discardCaseFile,
      toolTipPlacement: "left-end",
    });
  }

  return tableActions;
};
