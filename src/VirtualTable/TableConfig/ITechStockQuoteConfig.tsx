import { TableEnum } from "../../Model/iTechRestApi/TableEnum";
import BaseTableConfig from "./BaseTableConfig";

export default class ITechStockQuoteConfig extends BaseTableConfig {
  constructor() {
    super(TableEnum.iTechStockQuote);
    this.hideCheckBox = true;
  }
}
