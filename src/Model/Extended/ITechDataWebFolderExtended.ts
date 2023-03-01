import { ITechDataWebFolder } from "../iTechRestApi/ITechDataWebFolder";
import { ITechDataWebMenuExtended } from "./ITechDataWebMenuExtended";

export interface ITechDataWebFolderExtended extends ITechDataWebFolder {
  name: string;
  icon: string;
  iTechDataWebMenus: ITechDataWebMenuExtended[];
  path: string;
  selected: boolean;
  iTechDataWebFolders: ITechDataWebFolderExtended[];
}
