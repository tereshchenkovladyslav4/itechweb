import React from "react";
import { trackPromise } from "react-promise-tracker";
import { MenuAction } from "../../Menu/MenuFunction";
import { ITechDataSecurityObject } from "../../Model/iTechRestApi/ITechDataSecurityObject";
import { TableEnum } from "../../Model/iTechRestApi/TableEnum";
import IconManager from "../../_components/IconManager";
import { securityObjectService } from "../../_services/securityObjectService";
import AdminSecurityObjectDlg from "../AdminSecurityObjectDlg";
import { ITableActionProps } from "../Components/ITableActionProps";
import { ITableFormProps } from "../Components/ITableFormProps";
import RowEditAction from "../Components/RowEditAction";
import { DisabledStyle } from "../Components/RowStyle";
import ConfirmActionDialog from "../ConfirmActionDlg";
import { RowClickDialogAction } from "../RowClickAction";
import { DialogType } from "../VirtualTable.actions";
import BaseTableConfig from "./BaseTableConfig";

export default class ITechWebSecurityObjectConfig extends BaseTableConfig {
  constructor() {
    super(TableEnum.iTechWebSecurityObject);
    this.hideCheckBox = true;
    this.onRowClick = (props) => RowClickDialogAction(props, DialogType.adminEditSecurityObject);
    this.rowActionComponent = (props) => (
      <RowEditAction
        {...props}
        editAction={DialogType.adminEditSecurityObject}
        removeAction={DialogType.adminArchiveSecurityObject}
        dataSource={TableEnum[this.dataSource]}
        menuActions={[
          {
            icon: (
              <IconManager
                fontSize="small"
                icon="Key"
                onClick={() =>
                  props
                    .selectOnClick(String(props.rowData["gid"]), props.rowData)
                    .then(() => props.showDialog?.(DialogType.adminResetPassword))
                }
              />
            ),
            name: "Reset Password",
            id: 3,
            toolTipPlacement: "left-end",
          },
        ]}
      />
    );
    this.rowStyle = (props) =>
      DisabledStyle({
        ...props,
        dataSource: this.dataSource,
        selectedId: props.selectedRow?.currentSelected?.gid,
      });
  }

  forms = ({ selectedRow, showDialog, setShowDialog }: ITableFormProps): JSX.Element => {
    const _adminUserFormSave = (user: ITechDataSecurityObject): Promise<string[]> => {
      const service = !user.rowId
        ? securityObjectService.adminAdd
        : securityObjectService.adminUpdate;
      return trackPromise(service(user));
    };

    const _archiveUser = () => {
      if (selectedRow?.gid) {
        return securityObjectService.adminArchive(selectedRow?.gid).then(() => {
          setShowDialog(DialogType.none);
        });
      }
    };

    const _resetPassword = () => {
      if (selectedRow?.gid) {
        return securityObjectService.adminResetPassword(selectedRow?.gid).then(() => {
          setShowDialog(DialogType.none);
        });
      }
    };

    return (
      <>
        <AdminSecurityObjectDlg
          show={
            showDialog === DialogType.adminAddSecurityObject ||
            showDialog === DialogType.adminEditSecurityObject
          }
          setShow={(show: boolean) => setShowDialog(show ? showDialog : DialogType.none)}
          onSave={_adminUserFormSave}
          gid={showDialog === DialogType.adminEditSecurityObject ? selectedRow?.gid : undefined}
        />
        <ConfirmActionDialog
          area="ResetPassword"
          title="Reset Password"
          dialogContent={{
            text: "Reset password email will be sent to this user",
          }}
          show={showDialog === DialogType.adminResetPassword}
          onClose={() => setShowDialog(DialogType.none)}
          onConfirm={_resetPassword}
        />
        <ConfirmActionDialog
          area="ArchiveSecurityObject"
          title="Revoke Access"
          dialogContent={{
            text: "This login will be archived and will not have access",
          }}
          show={showDialog === DialogType.adminArchiveSecurityObject}
          onClose={() => setShowDialog(DialogType.none)}
          onConfirm={_archiveUser}
        />
      </>
    );
  };

  tableActions = ({ setShowDialog, checkedRows, allChecked }: ITableActionProps): MenuAction[] => {
    return [
      {
        icon: <IconManager fontSize="small" icon="Add" />,
        name: "Create Login ",
        id: 1,
        toolTipPlacement: "left-end",
        onClick: () => setShowDialog(DialogType.adminAddSecurityObject),
      },
    ];
  };
}
