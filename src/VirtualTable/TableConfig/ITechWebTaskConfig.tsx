import React from "react";
import { TableEnum } from "../../Model/iTechRestApi/TableEnum";
import { QuerySet } from "../../Model/Types/QuerySet";
import { ITableFormProps } from "../Components/ITableFormProps";
import { RowAction } from "../Components/RowAction";
import { DialogType, TableActionId } from "../VirtualTable.actions";
import BaseTableConfig from "./BaseTableConfig";
import ModifyTasksDlg from "../ModifyTasksDlg";
import { ITableActionProps } from "../Components/ITableActionProps";
import { MenuAction } from "../../Menu/MenuFunction";
import IconManager from "../../_components/IconManager";

const actionTaskTypes = ["", "Manual Review an item", "Automatic Review an item"];

export default class ITechWebTaskConfig extends BaseTableConfig {
  constructor() {
    super(TableEnum.iTechWebTask);
    this.disableTableActionMenu = true;
    this.rowActionComponent = (props) =>
      !actionTaskTypes.includes(props.rowData?.taskTypeDescription?.trim() || "") ? (
        <RowAction {...props} dataSource={TableEnum[this.dataSource]} />
      ) : null;
  }

  forms = ({
    showDialog,
    setShowDialog,
    checkedRows,
    allChecked,
    searchText,
    expressions,
  }: ITableFormProps): JSX.Element => {
    return (
      <ModifyTasksDlg
        show={showDialog === DialogType.modifyTask}
        setShow={(show: boolean) => setShowDialog(show ? DialogType.modifyTask : DialogType.none)}
        allChecked={allChecked}
        rowIds={checkedRows}
        filter={allChecked ? ({ searchText, expressions } as QuerySet) : undefined}
      />
    );
  };

  tableActions = ({ setShowDialog }: ITableActionProps): MenuAction[] => {
    return [
      {
        icon: <IconManager fontSize="small" icon="Settings" />,
        name: "Update Task(s) ",
        id: TableActionId.modifyTask,
        toolTipPlacement: "left-end",
        onClick: () => setShowDialog(DialogType.modifyTask),
      },
    ];
  };
}
