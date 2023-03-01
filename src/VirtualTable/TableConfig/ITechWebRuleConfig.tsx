import React from "react";
import { trackPromise } from "react-promise-tracker";
import { MenuAction } from "../../Menu/MenuFunction";
import { RuleTaskExtended } from "../../Model/Extended/RuleTaskExtended";
import { TableEnum } from "../../Model/iTechRestApi/TableEnum";
import { ruleService } from "../../_services/ruleService";
import { ITableActionProps } from "../Components/ITableActionProps";
import { ITableFormProps } from "../Components/ITableFormProps";
import { RowClickDialogAction } from "../RowClickAction";
import { DialogType } from "../VirtualTable.actions";
import BaseTableConfig from "./BaseTableConfig";
import RowEditAction from "../Components/RowEditAction";
import ConfirmActionDialog from "../ConfirmActionDlg";
import AddRuleDlg from "../AddRuleDlg";
import IconManager from "../../_components/IconManager";
import { DisabledStyle } from "../Components/RowStyle";

export default class ITechWebRuleConfig extends BaseTableConfig {
  constructor() {
    super(TableEnum.iTechWebRule);
    this.rowActionComponent = (props) => (
      <RowEditAction
        {...props}
        editAction={DialogType.editRule}
        removeAction={DialogType.removeRule}
        dataSource={TableEnum[this.dataSource]}
      />
    );
    //this.onRowClick = (props) => RowClickDialogAction(props, DialogType.editRule);
    this.rowStyle = (props) =>
      DisabledStyle({
        ...props,
        dataSource: this.dataSource,
        selectedId: props.selectedRow?.currentSelected?.gid,
      });
  }

  readonly _ruleDlgs = [DialogType.editRule, DialogType.addRule];
  readonly _removeRuleDlgs = [DialogType.removeRule, DialogType.removeSelectedRule];

  forms = ({
    showDialog,
    setShowDialog,
    selectedRow,
    checkedRows,
    refreshTable,
  }: ITableFormProps): JSX.Element => {
    const _saveRule = (rule: RuleTaskExtended) => {
      const service = rule.rowId === 0 ? ruleService.add : ruleService.update;
      trackPromise(
        service(rule).then(() => {
          setShowDialog(DialogType.none);
          refreshTable();
        })
      );
    };
    const _onConfirmActionCloseClick = () => setShowDialog(DialogType.none);

    const _removeRule = () => {
      const gids: (string | number | undefined)[] =
        showDialog === DialogType.removeSelectedRule
          ? checkedRows.map((x) => parseInt(x))
          : [selectedRow?.gid];

      trackPromise(
        ruleService.remove(gids).then(() => {
          setShowDialog(DialogType.none);
          refreshTable();
        })
      );
    };

    const plural =
      checkedRows.length > 1 && showDialog === DialogType.removeSelectedRule ? "s" : "";
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
        <ConfirmActionDialog
          area="Rule"
          title={`Remove Rule${plural}`}
          dialogContent={{
            text: `Remove ${
              showDialog === DialogType.removeSelectedRule ? `${checkedRows.length} ` : "this "
            }selected rule${plural}?`,
          }}
          show={this._removeRuleDlgs.includes(showDialog)}
          onClose={_onConfirmActionCloseClick}
          onConfirm={_removeRule}
        />
        <AddRuleDlg
          show={this._ruleDlgs.includes(showDialog)}
          setShow={(show: boolean) => setShowDialog(show ? showDialog : DialogType.none)}
          onSave={_saveRule}
          gid={showDialog === DialogType.addRule ? undefined : selectedRow?.gid}
        />
      </>
    );
  };

  tableActions = ({ setShowDialog, checkedRows }: ITableActionProps): MenuAction[] => {
    const tableActions: MenuAction[] = [];

    tableActions.push({
      icon: <IconManager fontSize="small" icon="Add" />,
      name: "Add Rule ",
      id: 1,
      toolTipPlacement: "left-end",
      onClick: () => setShowDialog(DialogType.addRule),
    });

    if (checkedRows.length > 0) {
      tableActions.push({
        icon: <IconManager fontSize="small" icon="RemoveCircle" />,
        name: "Remove Selected ",
        id: 2,
        toolTipPlacement: "left-end",
        onClick: () => setShowDialog(DialogType.removeSelectedRule),
      });
    }
    tableActions.push({
      icon: <IconManager fontSize="small" icon="Settings" />,
      name: "Run Rules ",
      id: 3,
      toolTipPlacement: "left-end",
      onClick: () => setShowDialog(DialogType.confirmRuleAction),
    });

    return tableActions;
  };
}
