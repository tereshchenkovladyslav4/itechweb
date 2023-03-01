import React from "react";
import { TableEnum } from "../../Model/iTechRestApi/TableEnum";
import { CellLink } from "../Components/CellLink";
import { ExportDataButton } from "../Components/ExportDataButton";
import { LinkType } from "../Components/ICellProps";
import { ITableFunctionProps } from "../Components/ITableFunctionProps";
import BaseTableConfig from "./BaseTableConfig";

export default class ITechWebEodhdNewsConfig extends BaseTableConfig {
  constructor() {
    super(TableEnum.iTechWebEodhdNews);
    this.hideCheckBox = true;
    this.preventSelection = true;
    this.cellComponent = (props) => (
      <CellLink {...props} displayColumn="webLink" linkType={LinkType.Value} target="_blank" />
    );
  }

  tableFunctions = (props: ITableFunctionProps): JSX.Element => (
    <ExportDataButton {...props} dataSource={TableEnum[this.dataSource]} />
  );
}
