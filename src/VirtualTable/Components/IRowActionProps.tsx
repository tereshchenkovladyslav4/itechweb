import { DialogType } from "../VirtualTable.actions";

export default interface IRowActionProps {
  rowData: any;
  refreshTable?: () => void;
  dataSource?: string;
  selectOnClick: (gid: any, rowData?: any) => Promise<void>;
  showDialog?: (dialog: DialogType) => void;
}
