import { ITechDataWebTab } from "../iTechRestApi/ITechDataWebTab";

export interface ITechDataWebTabExtended extends ITechDataWebTab {
  path: string;
  isHightlighted: boolean;
  selected: boolean;
}
