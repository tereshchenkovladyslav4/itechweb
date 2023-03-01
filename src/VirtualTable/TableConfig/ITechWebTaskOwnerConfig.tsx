import React from "react";
import { MenuAction } from "../../Menu/MenuFunction";
import { TableEnum } from "../../Model/iTechRestApi/TableEnum";
import IconManager from "../../_components/IconManager";
import { ITableActionProps } from "../Components/ITableActionProps";
import { ITableFormProps } from "../Components/ITableFormProps";
import ModifyTaskOwnerDlg from "../ModifyTaskOwnerDlg";
import { DialogType, TableActionId } from "../VirtualTable.actions";
import BaseTableConfig from "./BaseTableConfig";

export default class ITechWebTaskOwnerConfig extends BaseTableConfig {
  constructor() {
    super(TableEnum.iTechWebTaskOwner);
    this.hideCheckBox = true;
    this.preventSelection = true;
    this.onRowClick = () => {};
  }

  forms = ({ showDialog, setShowDialog }: ITableFormProps): JSX.Element => {
    return (
      <ModifyTaskOwnerDlg
        show={showDialog === DialogType.modifyTaskOwner}
        setShow={(show: boolean) =>
          setShowDialog(show ? DialogType.modifyTaskOwner : DialogType.none)
        }
      />
    );
  };

  tableActions = ({ setShowDialog }: ITableActionProps): MenuAction[] => {
    return [
      {
        icon: <IconManager fontSize="small" icon="Settings" />,
        name: "Change workflow owner ",
        id: TableActionId.modifyTaskOwner,
        toolTipPlacement: "left-end",
        onClick: () => setShowDialog(DialogType.modifyTaskOwner),
      },
    ];
  };
}
