import { QuerySet } from "../../Model/Types/QuerySet";
import { DialogType } from "../VirtualTable.actions";

export interface ITableFunctionProps {
  querySet: QuerySet;
  numberOfResultsFound: number | undefined;
  setShowDialog: (dialog: DialogType) => void;
  dataSource?: string;
}
