import React from "react";
import { TableEnum } from "../../Model/iTechRestApi/TableEnum";
import { ITableFunctionProps } from "../Components/ITableFunctionProps";
import { ExportDataButton } from "../Components/ExportDataButton";
import BaseTableConfig from "./BaseTableConfig";

export default class ITechStockHeaderConfig extends BaseTableConfig {
  constructor() {
    super(TableEnum.iTechStockHeader);
    this.hideCheckBox = true;
  }

  tableFunctions = (props: ITableFunctionProps): JSX.Element => (
    <ExportDataButton {...props} dataSource={TableEnum[this.dataSource]} />
  );
}
