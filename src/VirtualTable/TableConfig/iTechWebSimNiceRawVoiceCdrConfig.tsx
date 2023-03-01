import { TableEnum } from "../../Model/iTechRestApi/TableEnum";
import BaseTableConfig from "./BaseTableConfig";

export default class iTechWebSimNiceRawVoiceCdrConfig extends BaseTableConfig {
  constructor() {
    super(TableEnum.iTechWebSimNiceRawVoiceCdr);
    this.tableActions = () => [];
  }
}
