import React from "react";
import { DialogType } from "../VirtualTable.actions";
import { TableEnum } from "../../Model/iTechRestApi/TableEnum";
import { RowClickDialogAction } from "../RowClickAction";
import { ITableFormProps } from "../Components/ITableFormProps";
import { trackPromise } from "react-promise-tracker";
import { SurveillanceTask } from "../../Model/iTechRestApi/SurveillanceTask";
import { surveillanceService } from "../../_services/surveillanceService";
import { ruleService } from "../../_services/ruleService";
import BaseTableConfig from "./BaseTableConfig";
import RowEditAction from "../Components/RowEditAction";
import ConfirmActionDialog from "../ConfirmActionDlg";
import AddSurveillanceDlg from "../AddSurveillanceDlg";
import { ITableActionProps } from "../Components/ITableActionProps";
import { MenuAction } from "../../Menu/MenuFunction";
import IconManager from "../../_components/IconManager";
import { DisabledStyle } from "../Components/RowStyle";
import { SurveillanceTaskExtended } from "../../Model/Extended/SurveillanceTaskExtended";

export default class ITechWebSurveillanceConfig extends BaseTableConfig {
  constructor() {
    super(TableEnum.iTechWebSurveillance);
    this.rowActionComponent = (props) => (
      <RowEditAction
        {...props}
        editAction={DialogType.editSurveillance}
        removeAction={DialogType.removeSurveillance}
        dataSource={TableEnum[this.dataSource]}
      />
    );
    this.onRowClick = (props) => RowClickDialogAction(props, DialogType.editSurveillance);
    this.rowStyle = (props) =>
      DisabledStyle({
        ...props,
        dataSource: this.dataSource,
        selectedId: props.selectedRow?.currentSelected?.gid,
      });
  }

  readonly _surveillanceDlgs = [DialogType.editSurveillance, DialogType.addSurveillance];
  readonly _removeSurveillanceDlgs = [
    DialogType.removeSurveillance,
    DialogType.removeSelectedSurveillance,
  ];

  forms = ({
    showDialog,
    setShowDialog,
    selectedRow,
    checkedRows,
    refreshTable,
  }: ITableFormProps): JSX.Element => {
    const _onConfirmActionCloseClick = () => setShowDialog(DialogType.none);

    const _saveSurveillance = (surveillance: SurveillanceTaskExtended) => {
      const service =
        surveillance.rowId === 0 ? surveillanceService.add : surveillanceService.update;
      trackPromise(
        service(surveillance).then(() => {
          setShowDialog(DialogType.none);
          refreshTable();
        })
      );
    };

    const _removeRule = () => {
      const gids: (string | number | undefined)[] =
        showDialog === DialogType.removeSelectedSurveillance
          ? checkedRows.map((x) => parseInt(x))
          : [selectedRow?.gid];

      trackPromise(
        ruleService.remove(gids).then(() => {
          setShowDialog(DialogType.none);
          refreshTable();
        })
      );
    };

    return (
      <>
        <ConfirmActionDialog
          area="Surveillance"
          title="Surveillance Rules"
          dialogContent={{ text: "Run all surveillance rules now?" }}
          show={showDialog === DialogType.confirmRuleAction}
          onClose={_onConfirmActionCloseClick}
          onConfirm={_onConfirmActionCloseClick}
        />
        <AddSurveillanceDlg
          show={this._surveillanceDlgs.includes(showDialog)}
          setShow={(show: boolean) => setShowDialog(show ? showDialog : DialogType.none)}
          onSave={_saveSurveillance}
          gid={showDialog === DialogType.addSurveillance ? undefined : selectedRow?.gid}
        />
        <ConfirmActionDialog
          area="Surveillance"
          title="Remove Surveillance"
          dialogContent={{
            text: `Remove ${
              showDialog === DialogType.removeSelectedSurveillance
                ? `${checkedRows.length} `
                : "this "
            }selected surveillance?`,
          }}
          show={this._removeSurveillanceDlgs.includes(showDialog)}
          onClose={_onConfirmActionCloseClick}
          onConfirm={_removeRule}
        />
      </>
    );
  };

  tableActions = ({ setShowDialog, checkedRows }: ITableActionProps): MenuAction[] => {
    const tableActions: MenuAction[] = [];

    tableActions.push({
      icon: <IconManager fontSize="small" icon="Add" />,
      name: "Add Surveillance ",
      id: 1,
      toolTipPlacement: "left-end",
      onClick: () => setShowDialog(DialogType.addSurveillance),
    });
    if (checkedRows.length > 0) {
      tableActions.push({
        icon: <IconManager fontSize="small" icon="RemoveCircle" />,
        name: "Remove Selected ",
        id: 2,
        toolTipPlacement: "left-end",
        onClick: () => setShowDialog(DialogType.removeSelectedSurveillance),
      });
    }
    tableActions.push({
      icon: <IconManager fontSize="small" icon="Settings" />,
      name: "Run Rules ",
      id: 3,
      toolTipPlacement: "left-end",
      onClick: () => setShowDialog(DialogType.confirmRuleAction), // TODO
    });

    return tableActions;
  };
}
