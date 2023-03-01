import React from "react";
import { TableEnum } from "../../Model/iTechRestApi/TableEnum";
import BaseTableConfig from "./BaseTableConfig";
import IconManager from "../../_components/IconManager";
import { ITableActionProps } from "../Components/ITableActionProps";
import { MenuAction } from "../../Menu/MenuFunction";

export default class iTechWebSimIpcUnigyRawCdrConfig extends BaseTableConfig {
  constructor() {
    super(TableEnum.iTechWebSimIpcUnigyRawCdr);
  }

  tableActions = ({ checkedRows }: ITableActionProps): MenuAction[] => {
    const tableActions: MenuAction[] = [];
    if (checkedRows.length > 0) {
      tableActions.push({
        icon: <IconManager fontSize="small" icon="Send" />,
        name: "Re-test ",
        id: -1,
        toolTipPlacement: "left-end",
        onClick: () => {}, // TODO - callback to send re-test request for ids
      });
    }
    return tableActions;
  };
}
