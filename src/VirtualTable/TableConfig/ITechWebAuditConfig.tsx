import { TableEnum } from "../../Model/iTechRestApi/TableEnum";
import BaseTableConfig from "./BaseTableConfig";

export default class ITechWebAuditConfig extends BaseTableConfig {
  constructor() {
    super(TableEnum.iTechWebAudit);
    this.hideCheckBox = true;
  }
}
