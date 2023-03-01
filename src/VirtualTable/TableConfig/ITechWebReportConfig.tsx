import { TableEnum } from "../../Model/iTechRestApi/TableEnum";
import BaseTableConfig from "./BaseTableConfig";

export default class ITechWebReportConfig extends BaseTableConfig {
  constructor() {
    super(TableEnum.iTechWebReport);
    this.disableTableActionMenu = true;
    this.hideCheckBox = true;
  }
}
