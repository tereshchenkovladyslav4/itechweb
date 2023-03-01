import { ITechDataWebMenu } from "../iTechRestApi/ITechDataWebMenu";
import { ITechDataWebTabExtended } from "./ITechDataWebTabExtended";

export interface ITechDataWebMenuExtended extends ITechDataWebMenu {
  name: string;
  icon: string;
  iTechDataWebTabs: ITechDataWebTabExtended[];
  path: string;
  selected: boolean;
}
