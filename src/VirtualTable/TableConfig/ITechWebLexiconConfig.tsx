import React from "react";
import { DialogType, TableActionId } from "../VirtualTable.actions";
import { TableEnum } from "../../Model/iTechRestApi/TableEnum";
import { RowClickDialogAction } from "../RowClickAction";
import { ITableFormProps } from "../Components/ITableFormProps";
import { Lexicon } from "../../Model/iTechRestApi/Lexicon";
import { trackPromise } from "react-promise-tracker";
import { lexiconService } from "../../_services/lexiconService";
import BaseTableConfig from "./BaseTableConfig";
import RowEditAction from "../Components/RowEditAction";
import AddToLexiconGroupDlg from "../AddToLexiconGroupDlg";
import ConfirmActionDialog from "../ConfirmActionDlg";
import AddLexiconDlg from "../AddLexiconDlg";
import { ITableActionProps } from "../Components/ITableActionProps";
import { MenuAction } from "../../Menu/MenuFunction";
import IconManager from "../../_components/IconManager";

export default class ITechWebLexiconConfig extends BaseTableConfig {
  constructor() {
    super(TableEnum.iTechWebLexicon);
    this.rowActionComponent = (props) => (
      <RowEditAction
        {...props}
        editAction={DialogType.editLexicon}
        removeAction={DialogType.removeLexicon}
        dataSource={TableEnum[this.dataSource]}
      />
    );
    this.onRowClick = (props) => RowClickDialogAction(props, DialogType.editLexicon);
  }

  readonly _lexiconDlgs = [DialogType.editLexicon, DialogType.addLexicon];
  readonly _removeLexiconDlgs = [DialogType.removeLexicon, DialogType.removeSelectedLexicon];

  forms = ({
    showDialog,
    setShowDialog,
    selectedRow,
    checkedRows,
    refreshTable,
  }: ITableFormProps): JSX.Element => {
    const _onConfirmActionCloseClick = () => setShowDialog(DialogType.none);

    const _saveLexicon = (lexicon: Lexicon) => {
      const service = lexicon.gid === undefined ? lexiconService.add : lexiconService.update;
      return trackPromise(
        service(lexicon).then(() => {
          setShowDialog(DialogType.none);
          refreshTable();
        })
      );
    };

    const _removeLexiconRef = (lexicon: Lexicon, alternative: Lexicon) => {
      if (lexicon.gid === undefined || alternative.gid === undefined)
        return Promise.reject("Undefined lexicon");

      return trackPromise(lexiconService.removeReferences(lexicon.gid, [alternative.gid])).then(
        () => {
          refreshTable();
        }
      );
    };

    const _removeLexicon = () => {
      const gids: (string | number | undefined)[] =
        showDialog === DialogType.removeSelectedLexicon
          ? checkedRows.map((x) => parseInt(x))
          : [selectedRow?.gid];

      trackPromise(
        lexiconService.deleteLexicons(gids).then(() => {
          // TODO: display not deleted lexicons => see delete terms
          setShowDialog(DialogType.none);
          refreshTable();
        })
      );
    };

    return (
      <>
        <AddLexiconDlg
          show={this._lexiconDlgs.includes(showDialog)}
          setShow={(show: boolean) => setShowDialog(show ? showDialog : DialogType.none)}
          onSave={_saveLexicon}
          onRemove={_removeLexiconRef}
          gid={showDialog === DialogType.addLexicon ? undefined : selectedRow?.gid}
        />
        <ConfirmActionDialog
          area="Lexicon"
          title="Remove Lexicon"
          dialogContent={{
            text: `Remove ${
              showDialog === DialogType.removeSelectedLexicon ? `${checkedRows.length} ` : "this "
            }selected lexicon?`,
          }}
          show={this._removeLexiconDlgs.includes(showDialog)}
          onClose={_onConfirmActionCloseClick}
          onConfirm={_removeLexicon}
        />
        <AddToLexiconGroupDlg
          show={showDialog === DialogType.addToLexiconGroup}
          setShow={(show: boolean) =>
            setShowDialog(show ? DialogType.addToLexiconGroup : DialogType.none)
          }
          rowIds={checkedRows}
        />
      </>
    );
  };

  tableActions = ({ setShowDialog, checkedRows }: ITableActionProps): MenuAction[] => {
    const tableActions: MenuAction[] = [];

    tableActions.push({
      icon: <IconManager fontSize="small" icon="Add" />,
      name: "Create ",
      id: TableActionId.addLexicon,
      toolTipPlacement: "left-end",
      onClick: () => setShowDialog(DialogType.addLexicon),
    });

    if (checkedRows.length > 0) {
      tableActions.push({
        icon: <IconManager fontSize="small" icon="HighlightOff" />,
        name: "Delete ",
        id: TableActionId.removeLexicon,
        toolTipPlacement: "left-end",
        onClick: () => setShowDialog(DialogType.removeSelectedLexicon),
      });
      tableActions.push({
        icon: <IconManager fontSize="small" icon="Language" />,
        name: "Add to Lexicon Group ",
        id: TableActionId.addToLexiconGroup,
        toolTipPlacement: "left-end",
        onClick: () => setShowDialog(DialogType.addToLexiconGroup),
      });
    }
    return tableActions;
  };
}
