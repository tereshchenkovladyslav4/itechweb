import React, { useState } from "react";
import { trackPromise } from "react-promise-tracker";
import { MenuAction } from "../../Menu/MenuFunction";
import { CheckedAction } from "../../Model/iTechRestApi/CheckedAction";
import { ICheckedSet } from "../../Model/iTechRestApi/ICheckedSet";
import { ITechDataTerm } from "../../Model/iTechRestApi/ITechDataTerm";
import { TableEnum } from "../../Model/iTechRestApi/TableEnum";
import IconManager from "../../_components/IconManager";
import { TermResult, termService } from "../../_services/termService";
import AddTermDlg from "../AddTermDlg";
import { ITableActionProps } from "../Components/ITableActionProps";
import { ITableFormProps } from "../Components/ITableFormProps";
import TermSwitch from "../Components/TermSwitch";
import ConfirmDialogWithResult, { DlgContent } from "../ConfirmActionDlgWithResult";
import { DialogType, TableActionId } from "../VirtualTable.actions";
import BaseTableConfig from "./BaseTableConfig";

export default class ITechWebTermConfig extends BaseTableConfig {
  constructor() {
    super(TableEnum.iTechWebTerm);
    this.rowActionComponent = (props) => <TermSwitch {...props} />;
  }

  saveAllTerms = (action: CheckedAction, props: ITableFormProps): Promise<TermResult> => {
    const { allChecked, checkedRows, expressions, searchText, refreshTable } = props;

    const gids = checkedRows.map((x: any) => parseInt(x));
    if (!allChecked && action === CheckedAction.add)
      return termService.addReferences(gids).then((res) => {
        refreshTable();
        return { count: res, terms: null };
      });
    if (!allChecked && action === CheckedAction.remove)
      return termService.removeReferences(gids).then((res) => {
        refreshTable();
        return { count: res, terms: null };
      });
    if (!allChecked && action === CheckedAction.delete)
      return termService.deleteTerms(gids).then((res) => {
        if (res.count) {
          refreshTable();
        }
        return res;
      });
    if (allChecked) {
      const checkedSet = {
        action: action,
        expressions,
        search: searchText,
        excludedIds: gids,
      } as ICheckedSet;
      return termService.allChecked(checkedSet).then((res) => {
        refreshTable();
        return res;
      });
    }
    return Promise.reject();
  };

  tableActions = (props: ITableActionProps): MenuAction[] => {
    const { caseId, checkedRows, setShowDialog } = props;
    const tableActions: MenuAction[] = [];
    tableActions.push({
      icon: <IconManager fontSize="small" icon="Add" />,
      name: "Add Term ",
      id: TableActionId.addTerm,
      toolTipPlacement: "left-end",
      onClick: () => setShowDialog(DialogType.addTerm),
    });

    if (caseId !== undefined && checkedRows.length > 0) {
      tableActions.push({
        icon: <IconManager fontSize="small" icon="AddCircle" />,
        name: "Add term(s) to case ",
        id: TableActionId.addTermToCase,
        toolTipPlacement: "left-end",
        onClick: () => this.saveAllTerms(CheckedAction.add, props),
      });
      tableActions.push({
        icon: <IconManager fontSize="small" icon="RemoveCircle" />,
        name: "Remove term(s) from case ",
        id: TableActionId.removeTerm,
        toolTipPlacement: "left-end",
        onClick: () => this.saveAllTerms(CheckedAction.remove, props),
      });
    }

    if (checkedRows.length > 0) {
      tableActions.push({
        icon: <IconManager fontSize="small" icon="HighlightOff" />,
        name: "Delete term(s)",
        id: TableActionId.deleteTerm,
        toolTipPlacement: "left-end",
        onClick: () => setShowDialog(DialogType.deleteTerms),
      });
    }

    return tableActions;
  };

  forms = (props: ITableFormProps): JSX.Element => {
    const { showDialog, setShowDialog, refreshTable, checkedRows } = props;

    const _defaultText = { text: "Are you sure?" };
    const [confirmDeleteDlgText, setConfirmDeleteDlgText] = useState<DlgContent>(_defaultText);
    const [showConfirmDeleteResults, setShowConfirmDeleteResults] = useState(false);
    const termDlgArea = "termDlgArea";

    const _saveTerm = (term: ITechDataTerm) => {
      return termService.add(term).then(() => {
        setShowDialog(DialogType.none);
        refreshTable();
      });
    };

    const TermsList = (terms: string[]): DlgContent => {
      return {
        text: "The following terms are referenced in cases and can not be deleted:",
        content: <ul>{terms && terms.map((t, i) => <li key={i}>{t}</li>)}</ul>,
      };
    };

    const _onDeleteTermConfirm = () => {
      trackPromise(this.saveAllTerms(CheckedAction.delete, props), termDlgArea).then((result) => {
        if (result.terms != null && result.terms.length) {
          setConfirmDeleteDlgText(TermsList(result.terms));
          setShowConfirmDeleteResults(true);
        } else {
          _onDeleteTermDlgCloseClick();
        }
      });
    };

    const _onDeleteTermDlgCloseClick = () => {
      setShowDialog(DialogType.none);
      setConfirmDeleteDlgText(_defaultText);
      setShowConfirmDeleteResults(false);
    };

    const plural = checkedRows.length > 1 ? "s" : "";
    return (
      <>
        <AddTermDlg
          show={showDialog === DialogType.addTerm}
          setShow={(show: boolean) => setShowDialog(show ? DialogType.addTerm : DialogType.none)}
          onSave={_saveTerm}
        />
        <ConfirmDialogWithResult
          area={termDlgArea}
          title={`Delete term${plural}`}
          dialogContent={confirmDeleteDlgText}
          show={showDialog === DialogType.deleteTerms}
          showingResults={showConfirmDeleteResults}
          onClose={_onDeleteTermDlgCloseClick}
          onConfirm={_onDeleteTermConfirm}
        />
      </>
    );
  };
}
