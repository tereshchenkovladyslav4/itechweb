import { DataSource } from "../../Model/iTechRestApi/DataSource";
import SelectedGridRowType from "../../Model/Types/selectedGridRowType";
import { DialogType } from "../VirtualTable.actions";

export interface ITableFormProps {
  showDialog: DialogType;
  setShowDialog: (dialog: DialogType) => void;
  selectedRow: SelectedGridRowType | undefined;
  checkedRows: any[];
  allChecked: boolean;
  searchText: any;
  expressions: DataSource[];
  refreshTable: () => void;
  iTechControlTableRowId: number;
  setupRowId: number | null;
}
