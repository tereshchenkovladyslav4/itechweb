import React from "react";
import { trackPromise } from "react-promise-tracker";
import { MenuAction } from "../../Menu/MenuFunction";
import { TableEnum } from "../../Model/iTechRestApi/TableEnum";
import { userGroupService } from "../../_services/userGroupService";
import { ITableActionProps } from "../Components/ITableActionProps";
import { ITableFormProps } from "../Components/ITableFormProps";
import { RowClickDialogAction } from "../RowClickAction";
import { DialogType } from "../VirtualTable.actions";
import IconManager from "../../_components/IconManager";
import BaseTableConfig from "./BaseTableConfig";
import ManageGroupDlg from "../ManageGroupDlg";

export default class ITechWebUserGroupConfig extends BaseTableConfig {
  constructor() {
    super(TableEnum.iTechWebUserGroup);
    this.hideCheckBox = true;
    this.preventSelection = true;
    this.onRowClick = (props) => RowClickDialogAction(props, DialogType.editGroup);
  }

  readonly _editDlgs = [DialogType.addGroup, DialogType.editGroup];
  forms = ({
    selectedRow,
    showDialog,
    setShowDialog,
    refreshTable,
  }: ITableFormProps): JSX.Element => {
    const _saveGroup = (
      groupId: string | number | undefined,
      name: string | undefined,
      gids: number[]
    ): Promise<never | void> => {
      if (groupId)
        return trackPromise(userGroupService.references(groupId, gids)).then(() => {
          setShowDialog(DialogType.none);
          refreshTable();
        });
      else if (name)
        return trackPromise(userGroupService.add(name, gids)).then(() => {
          setShowDialog(DialogType.none);
          refreshTable();
        });

      return Promise.reject("Invalid request");
    };

    const _deleteGroup = (groupId: string | number | undefined): Promise<never | void> => {
      if (groupId)
        return userGroupService.deleteGroup(groupId).then(() => {
          setShowDialog(DialogType.none);
          refreshTable();
        });

      return Promise.reject("Invalid request");
    };

    const _removeGroupReference = (
      groupId: string | number,
      userId: string | number
    ): Promise<number | void> => {
      return trackPromise(
        userGroupService.removeReferences(groupId, [userId]).then(() => {
          refreshTable();
        })
      );
    };

    return (
      <ManageGroupDlg
        show={this._editDlgs.includes(showDialog)}
        setShow={(show: boolean) => setShowDialog(show ? DialogType.addGroup : DialogType.none)}
        onSave={_saveGroup}
        onDelete={_deleteGroup}
        onRemoveReference={_removeGroupReference}
        gid={showDialog === DialogType.editGroup ? undefined : selectedRow?.gid}
      />
    );
  };

  tableActions = ({ setShowDialog }: ITableActionProps): MenuAction[] => {
    return [
      {
        icon: <IconManager fontSize="small" icon="Add" />,
        name: "Add Group ",
        id: 1,
        toolTipPlacement: "left-end",
        onClick: () => setShowDialog(DialogType.addGroup),
      },
    ];
  };
}
