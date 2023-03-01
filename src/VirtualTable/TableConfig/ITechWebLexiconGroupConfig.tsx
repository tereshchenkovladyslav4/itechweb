import React from "react";
import { trackPromise } from "react-promise-tracker";
import { MenuAction } from "../../Menu/MenuFunction";
import { LexiconGroup } from "../../Model/iTechRestApi/LexiconGroup";
import { TableEnum } from "../../Model/iTechRestApi/TableEnum";
import IconManager from "../../_components/IconManager";
import { updateGridRowAction } from "../../_context/actions/PageDataActions";
import { lexiconGroupService } from "../../_services/lexiconGroupService";
import { ITableActionProps } from "../Components/ITableActionProps";
import { ITableFormProps } from "../Components/ITableFormProps";
import ManageLexiconGroupDlg from "../ManageLexiconGroupDlg";
import { IRowClickProps } from "../RowClickAction";
import { DialogType, TableActionId } from "../VirtualTable.actions";
import BaseTableConfig from "./BaseTableConfig";

export default class ITechWebLexiconGroupConfig extends BaseTableConfig {
  constructor() {
    super(TableEnum.iTechWebLexiconGroup);
    this.hideCheckBox = true;
    this.preventSelection = true;
    this.onRowClick = this._onRowClick;
  }

  _onRowClick({ selectOnClick, rowData, dispatch, showDialog }: IRowClickProps): void {
    selectOnClick(rowData.gid, rowData)
      .then(() => showDialog?.(DialogType.manageLexiconGroup))
      .then(() => dispatch?.(updateGridRowAction(undefined)));
  }

  forms = ({
    selectedRow,
    showDialog,
    setShowDialog,
    refreshTable,
  }: ITableFormProps): JSX.Element => {
    const _saveLexiconGroup = (group: LexiconGroup) => {
      if (group.gid === undefined)
        return trackPromise(lexiconGroupService.add(group)).then(() => {
          setShowDialog(DialogType.none);
          refreshTable();
        });

      return trackPromise(lexiconGroupService.update(group)).then(() => {
        setShowDialog(DialogType.none);
        refreshTable();
      });
    };

    const _deleteLexiconGroup = (groupId: string | number) => {
      return trackPromise(lexiconGroupService.deleteGroup(groupId)).then(() => {
        setShowDialog(DialogType.none);
        refreshTable();
      });
    };

    const _removeLexiconReference = (groupId: string | number, lexiconId: string | number) => {
      return trackPromise(lexiconGroupService.removeReferences(groupId, [lexiconId])).then(() => {
        refreshTable();
      });
    };

    return (
      <ManageLexiconGroupDlg
        show={showDialog === DialogType.manageLexiconGroup}
        setShow={(show: boolean) =>
          setShowDialog(show ? DialogType.manageLexiconGroup : DialogType.none)
        }
        onSave={_saveLexiconGroup}
        onDelete={_deleteLexiconGroup}
        onRemoveReference={_removeLexiconReference}
        gid={selectedRow?.gid}
      />
    );
  };

  tableActions = ({ setShowDialog }: ITableActionProps): MenuAction[] => {
    return [
      {
        icon: <IconManager fontSize="small" icon="Add" />,
        name: "Add Lexicon ",
        id: TableActionId.addLexiconGroup,
        toolTipPlacement: "left-end",
        onClick: () => setShowDialog(DialogType.manageLexiconGroup),
      },
    ];
  };
}
