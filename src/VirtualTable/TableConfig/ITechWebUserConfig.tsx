import React from "react";
import { trackPromise } from "react-promise-tracker";
import { TableEnum } from "../../Model/iTechRestApi/TableEnum";
import { userGroupService } from "../../_services/userGroupService";
import { userService } from "../../_services/userService";
import { ITableFormProps } from "../Components/ITableFormProps";
import { RowClickDialogAction } from "../RowClickAction";
import { DialogType } from "../VirtualTable.actions";
import { CheckedAction } from "../../Model/iTechRestApi/CheckedAction";
import { ICheckedSet } from "../../Model/iTechRestApi/ICheckedSet";
import ManageUserDlg from "../ManageUserDlg";
import BaseTableConfig from "./BaseTableConfig";
import MultiUserDlg from "../MultiUserDlg";
import { MenuAction } from "../../Menu/MenuFunction";
import { ITableActionProps } from "../Components/ITableActionProps";
import { CellInvestigation } from "../Components/CellLink";
import { ICellProps } from "../Components/ICellProps";
import { CellIcon } from "../Components/CellIcon";
import AdminUserDlg from "../AdminUserDlg";
import IconManager from "../../_components/IconManager";
import RowEditAction from "../Components/RowEditAction";
import { DisabledStyle } from "../Components/RowStyle";
import ConfirmActionDialog from "../ConfirmActionDlg";
import { ITechDataUser } from "../../Model/iTechRestApi/ITechDataUser";

export default class ITechWebUserConfig extends BaseTableConfig {
  constructor() {
    super(TableEnum.iTechWebUser);
    this.onRowClick = (props) => RowClickDialogAction(props, DialogType.adminEditUser);
    this.cellComponent = this.cellRender;
    this.rowActionComponent = (props) => (
      <RowEditAction
        {...props}
        editAction={DialogType.adminEditUser}
        removeAction={DialogType.adminArchiveUser}
        dataSource={TableEnum[this.dataSource]}
      />
    );
    this.rowStyle = (props) =>
      DisabledStyle({
        ...props,
        dataSource: this.dataSource,
        selectedId: props.selectedRow?.currentSelected?.gid,
      });
  }

  cellRender = (props: React.PropsWithChildren<ICellProps>): JSX.Element => {
    const { rowData, column } = props;
    const cellRenders = [
      {
        columnName: "name",
        component: (
          <CellInvestigation
            {...props}
            displayColumn="name"
            dataSource="user"
            referenceColumn="rowId"
            target="_blank"
          />
        ),
      },
      {
        columnName: "collectionJson",
        component: <CellIcon {...props} referenceColumn="collectionJson" />,
      },
    ];

    const cellRender = cellRenders.find((c) => c.columnName === column?.name);

    return cellRender ? cellRender.component : <>{rowData[column.name]}</>;
  };

  forms = ({
    selectedRow,
    showDialog,
    setShowDialog,
    allChecked,
    checkedRows,
    searchText,
    expressions,
    refreshTable,
  }: ITableFormProps): JSX.Element => {
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

    const _saveUser = (userId: string | number, gids: number[]) => {
      return userService.references(userId, gids).then(() => {
        setShowDialog(DialogType.none);
        refreshTable();
      });
    };

    const _addToGroup = (groupIds: number[]): Promise<number | void> => {
      return _multiUserGroup(groupIds, userGroupService.references, CheckedAction.add);
    };

    const _removeFromGroup = (groupIds: number[]): Promise<number | void> => {
      return _multiUserGroup(groupIds, userGroupService.removeReferences, CheckedAction.remove);
    };

    const _multiUserGroup = (
      groupIds: number[],
      request: (groupId: string | number, gids: number[]) => Promise<number>,
      action: CheckedAction
    ): Promise<number | void> => {
      const gids = checkedRows.map((x) => parseInt(x));
      let promises = undefined;
      if (!allChecked) {
        promises = groupIds.map((groupId) => request(groupId, gids));
      } else {
        const checkedSet = {
          action: action,
          expressions,
          search: searchText,
          excludedIds: gids,
        } as ICheckedSet;

        promises = groupIds.map((groupId) => userGroupService.allChecked(groupId, checkedSet));
      }

      if (promises?.length > 0)
        return trackPromise(Promise.all(promises)).then(() => {
          setShowDialog(DialogType.none);
          refreshTable();
        });
      return Promise.reject("Invalid request");
    };

    const _adminUserFormSave = (user: ITechDataUser): Promise<string[]> => {
      const service = user.rowId ? userService.adminUpdate : userService.adminAdd;
      return trackPromise(service(user));
    };

    const _archiveUser = () => {
      if (selectedRow?.gid) {
        return userService.adminArchive(selectedRow?.gid).then(() => {
          setShowDialog(DialogType.none);
        });
      }
    };

    return (
      <>
        <MultiUserDlg
          show={
            showDialog === DialogType.addSelectedToGroup ||
            showDialog === DialogType.removeSelectedFromGroup
          }
          setShow={(show: boolean) => setShowDialog(show ? showDialog : DialogType.none)}
          rowIds={allChecked ? [0, 0] : checkedRows} // hack to pluralise text in form
          addToGroup={showDialog === DialogType.addSelectedToGroup}
          onAddToGroup={_addToGroup}
          onRemoveFromGroup={_removeFromGroup}
        />
        <AdminUserDlg
          show={showDialog === DialogType.adminAddUser || showDialog === DialogType.adminEditUser}
          setShow={(show: boolean) => setShowDialog(show ? showDialog : DialogType.none)}
          onSave={_adminUserFormSave}
          gid={showDialog === DialogType.adminEditUser ? selectedRow?.gid : undefined}
        />
        <ConfirmActionDialog
          area="ArchiveUser"
          title="Archive"
          dialogContent={{
            text: "This collection user will be archived and will no longer be recorded",
          }}
          show={showDialog === DialogType.adminArchiveUser}
          onClose={() => setShowDialog(DialogType.none)}
          onConfirm={() => _archiveUser()}
        />
        {selectedRow?.gid && showDialog === DialogType.editUser && (
          <ManageUserDlg
            show={showDialog === DialogType.editUser}
            setShow={(show: boolean) => setShowDialog(show ? DialogType.editUser : DialogType.none)}
            onSave={_saveUser}
            onRemoveReference={_removeGroupReference}
            gid={selectedRow?.gid}
          />
        )}
      </>
    );
  };

  tableActions = ({ setShowDialog, checkedRows, allChecked }: ITableActionProps): MenuAction[] => {
    let actions = [
      {
        icon: <IconManager fontSize="small" icon="Add" />,
        name: "Create User ",
        id: 1,
        toolTipPlacement: "left-end",
        onClick: () => setShowDialog(DialogType.adminAddUser),
      } as MenuAction,
    ];

    if (checkedRows.length === 0 && !allChecked) return actions;

    actions = [
      ...actions,
      {
        icon: <IconManager fontSize="small" icon="GroupAdd" />,
        name: "Add To Group ",
        id: 1,
        toolTipPlacement: "left-end",
        onClick: () => setShowDialog(DialogType.addSelectedToGroup),
      },
      {
        icon: <IconManager fontSize="small" icon="GroupRemove" />,
        name: "Remove From Group ",
        id: 1,
        toolTipPlacement: "left-end",
        onClick: () => setShowDialog(DialogType.removeSelectedFromGroup),
      },
    ];

    return actions;
  };
}
