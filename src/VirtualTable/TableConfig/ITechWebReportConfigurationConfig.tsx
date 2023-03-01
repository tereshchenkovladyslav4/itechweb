import React from "react";
import { DialogType, TableActionId } from "../VirtualTable.actions";
import { TableEnum } from "../../Model/iTechRestApi/TableEnum";
import { RowClickDialogAction } from "../RowClickAction";
import { ITableFormProps } from "../Components/ITableFormProps";
import { trackPromise } from "react-promise-tracker";
import { reportConfigurationService } from "../../_services/reportConfigurationService";
import AddReport from "../../Menu/AddReport";
import ConfirmActionDialog from "../ConfirmActionDlg";
import BaseTableConfig from "./BaseTableConfig";
import RowEditAction from "../Components/RowEditAction";
import { IReportConfiguration } from "../../Model/iTechRestApi/IReportConfiguration";
import { ITableActionProps } from "../Components/ITableActionProps";
import { MenuAction } from "../../Menu/MenuFunction";
import IconManager from "../../_components/IconManager";
import { updateGridRowAction } from "../../_context/actions/PageDataActions";

export default class ITechWebReportConfigurationConfig extends BaseTableConfig {
  constructor() {
    super(TableEnum.iTechWebReportConfiguration);
    this.rowActionComponent = (props) => (
      <RowEditAction
        {...props}
        editAction={DialogType.editReportConfiguration}
        removeAction={DialogType.removeReportConfiguration}
        dataSource={TableEnum[this.dataSource]}
      />
    );
    this.onRowClick = (props) => RowClickDialogAction(props, DialogType.editReportConfiguration);
  }

  readonly _removeReportConfigurationDlgs = [
    DialogType.removeReportConfiguration,
    DialogType.removeSelectedReportConfiguration,
  ];

  forms = ({
    showDialog,
    setShowDialog,
    selectedRow,
    checkedRows,
    refreshTable,
  }: ITableFormProps): JSX.Element => {
    const onConfirmActionCloseClick = () => {
      setShowDialog(DialogType.none);
    };

    const removeReportConfiguration = () => {
      const gids: (string | number | undefined)[] =
        showDialog === DialogType.removeSelectedReportConfiguration
          ? checkedRows.map((x: any) => parseInt(x))
          : [selectedRow?.gid];

      trackPromise(
        reportConfigurationService.remove(gids).then(() => {
          setShowDialog(DialogType.none);
          refreshTable();
        })
      );
    };

    const addReportConfiguration = (submit: IReportConfiguration) => {
      const request =
        submit.gid === 0 ? reportConfigurationService.add : reportConfigurationService.edit;
      return request(submit).then(refreshTable);
    };

    return (
      <>
        <AddReport
          open={showDialog === DialogType.editReportConfiguration}
          setOpen={(show: boolean) =>
            setShowDialog(show ? DialogType.editReportConfiguration : DialogType.none)
          }
          gid={selectedRow?.gid}
          submit={addReportConfiguration}
        />
        <ConfirmActionDialog
          area="Report"
          title="Cancel Reporting"
          dialogContent={{
            text: `Cancel ${
              showDialog === DialogType.removeSelectedReportConfiguration
                ? `${checkedRows.length} `
                : "this "
            }selected report?`,
          }}
          show={this._removeReportConfigurationDlgs.includes(showDialog)}
          onClose={onConfirmActionCloseClick}
          onConfirm={removeReportConfiguration}
        />
      </>
    );
  };

  tableActions = ({ setShowDialog, dispatch, checkedRows }: ITableActionProps): MenuAction[] => {
    const tableActions: MenuAction[] = [];
    tableActions.push({
      icon: <IconManager fontSize="small" icon="Add" />,
      name: "Add Report ",
      id: TableActionId.editReportConfiguration,
      toolTipPlacement: "left-end",
      onClick: () => {
        setShowDialog(DialogType.editReportConfiguration);
        dispatch(updateGridRowAction(undefined));
      },
    });

    if (checkedRows.length > 0) {
      tableActions.push({
        icon: <IconManager fontSize="small" icon="HighlightOff" />,
        name: "Cancel Report(s) ",
        id: TableActionId.removeReportConfiguration,
        toolTipPlacement: "left-end",
        onClick: () => setShowDialog(DialogType.removeSelectedReportConfiguration),
      });
    }

    return tableActions;
  };
}
