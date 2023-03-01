import React from "react";
import { TableEnum } from "../../Model/iTechRestApi/TableEnum";
import { CellInvestigation } from "../Components/CellLink";
import { ExportDataButton } from "../Components/ExportDataButton";
import { ITableFunctionProps } from "../Components/ITableFunctionProps";
import BaseTableConfig from "./BaseTableConfig";

export default class ITechWebStockOrderConfig extends BaseTableConfig {
  constructor() {
    super(TableEnum.iTechWebStockOrder);
    this.hideCheckBox = true;
    this.preventSelection = true;
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

  tableFunctions = (props: ITableFunctionProps): JSX.Element => (
    <ExportDataButton {...props} dataSource={TableEnum[this.dataSource]} />
  );
}
