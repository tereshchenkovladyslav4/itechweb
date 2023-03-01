import { CaseModel } from "../../Model/iTechRestApi/CaseModel";
import { updateSelectedCaseAction } from "../actions/CaseActions";
import { useSelectors } from "../selectors/useSelectors";

// takes caseId selector, case fetch service, dispatch method
// updates stored case when required - clearing it if not a case
export const getCase = (
  selectors: ReturnType<typeof useSelectors>,
  service: (caseId: number) => Promise<CaseModel>,
  dispatch: React.Dispatch<any>
): void => {
  const caseId = selectors.getSelectedCaseId();
  if (caseId) {
    if (caseId !== selectors.getSelectedCase()?.rowId) {
      // TODO: needs loading bool in state to prevent duplicate calls to the service when called again before context update occurred
      service(caseId).then((result) => dispatch(updateSelectedCaseAction(result)));
    }
  } else {
    dispatch(updateSelectedCaseAction(undefined));
  }
};

export const reloadCase = (
  selectors: ReturnType<typeof useSelectors>,
  service: (caseId: number) => Promise<CaseModel>,
  dispatch: React.Dispatch<any>
): void => {
  const caseId = selectors.getSelectedCaseId();
  if (caseId) {
    service(caseId).then((result) => dispatch(updateSelectedCaseAction(result)));
  }
};

