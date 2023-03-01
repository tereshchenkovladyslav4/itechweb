import React from "react";
import { trackPromise } from "react-promise-tracker";
import { MenuAction } from "../../Menu/MenuFunction";
import { ITechWebAlert } from "../../Model/iTechRestApi/ITechWebAlert";
import { TableEnum } from "../../Model/iTechRestApi/TableEnum";
import { alertService } from "../../_services/alertService";
import { ITableFormProps } from "../Components/ITableFormProps";
import { menuAction, menuActionBuilder, openItem } from "../Components/MenuActionBuilder";
import { SpecifiedRowAction } from "../Components/RowAction";
import { RowStyle } from "../Components/RowStyle";
import { DialogType } from "../VirtualTable.actions";
import IRowActionProps from "../Components/IRowActionProps";
import BaseTableConfig from "./BaseTableConfig";
import EditActionDlg from "../EditActionDlg";
import { CellInvestigation } from "../Components/CellLink";

export default class ITechWebAlertConfig extends BaseTableConfig {
  constructor() {
    super(TableEnum.iTechWebAlert);
    this.hideCheckBox = true;
    this.rowActionComponent = (props) => (
      <SpecifiedRowAction
        {...props}
        dataSource={TableEnum[this.dataSource]}
        selectedItem={this._getSimRowId(props.rowData)}
        actions={this._menuActions(props)}
      />
    );
    this.rowStyle = (props) =>
      RowStyle({
        ...props,
        dataSource: this.dataSource,
        selectedId: props.selectedRow?.currentSelected?.gid, // override the selected ID
      });

    this.cellComponent = (props) => (
      <CellInvestigation
        {...props}
        displayColumn="userName"
        dataSource="user"
        referenceColumn="iTechDataUserRowId"
        target="_blank"
      />
    );
  }

  forms = ({
    showDialog,
    setShowDialog,
    selectedRow,
    refreshTable,
  }: ITableFormProps): JSX.Element => {
    const _editAlert = (alert: ITechWebAlert) => {
      return trackPromise(
        alertService.update(alert).then(() => {
          setShowDialog(DialogType.none);
          refreshTable();
        })
      );
    };

    return (
      <EditActionDlg
        show={showDialog === DialogType.editAlert}
        setShow={(show: boolean) => setShowDialog(show ? showDialog : DialogType.none)}
        onSave={_editAlert}
        gid={selectedRow?.currentSelected?.gid}
      />
    );
  };

  _menuActions(props: IRowActionProps): MenuAction[] {
    const { rowData, selectOnClick, showDialog } = props;
    return showDialog
      ? menuActionBuilder([
          openItem(String(rowData["gid"]), selectOnClick, rowData),
          menuAction(
            () =>
              selectOnClick(this._getSimRowId(rowData), rowData).then(() =>
                showDialog(DialogType.editAlert)
              ),
            "Send",
            "Manage"
          ),
        ])
      : [];
  }

  _getSimRowId(rowData: any): string {
    if (rowData["iTechSimRowId"]) return String(rowData["iTechSimRowId"]);
    if (rowData["iTechLinkedRowId"] && rowData["iTechControlTableReferenceTypeRowId"] === 7)
      return String(rowData["iTechLinkedRowId"]);

    return String(rowData["gid"]);
  }
}
