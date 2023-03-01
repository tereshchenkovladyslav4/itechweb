import React from "react";
import { TableEnum } from "../../Model/iTechRestApi/TableEnum";
import { ExportDataButton } from "../Components/ExportDataButton";
import { ITableFunctionProps } from "../Components/ITableFunctionProps";
import BaseTableConfig from "./BaseTableConfig";

export default class ITechStockOrderManagementConfig extends BaseTableConfig {
  constructor() {
    super(TableEnum.iTechStockOrderManagement);
    this.hideCheckBox = true;
  }

  tableFunctions = (props: ITableFunctionProps): JSX.Element => (
    <ExportDataButton {...props} dataSource={TableEnum[this.dataSource]} />
  );
}
