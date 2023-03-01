import { TableEnum } from "../../Model/iTechRestApi/TableEnum";
import BaseTableConfig from "./BaseTableConfig";

export default class ITechWebHrConfig extends BaseTableConfig {
  constructor() {
    super(TableEnum.iTechWebHr);
    this.disableTableActionMenu = true;
    this.hideCheckBox = true;
    this.preventSelection = true;
  }
}
