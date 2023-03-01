import { CSSProperties } from "react";
import { MenuAction } from "../../Menu/MenuFunction";
import { TableEnum } from "../../Model/iTechRestApi/TableEnum";
import { ICellProps } from "../Components/ICellProps";
import IRowActionProps from "../Components/IRowActionProps";
import { ITableActionProps } from "../Components/ITableActionProps";
import { ITableFormProps } from "../Components/ITableFormProps";
import { ITableFunctionProps } from "../Components/ITableFunctionProps";
import { IRowStyleProps } from "../Components/RowStyle";
import { IRowClickProps } from "../RowClickAction";

export default interface ITableConfig {
  /**
   * Data source / table name deriverd from TableEnum
   */
  readonly dataSource: TableEnum;

  /**
   * Disable search bar table actions if true
   */
  disableTableActionMenu: boolean;

  /**
   * Table menu action list associated with this data source
   */
  tableActions: (props: ITableActionProps) => MenuAction[];

  /**
   * Additional table functions (such as buttons) which do not belong in the table action list
   */
  tableFunctions?: React.FC<ITableFunctionProps> | null;

  /**
   * Remove checkbox column if true
   */
  hideCheckBox: boolean;

  /**
   * Remove select actions column if true
   */
  preventSelection: boolean;

  /**
   * Render row right-hand action display
   */
  rowActionComponent?: React.FC<IRowActionProps> | null;

  /**
   * Render form components - generally responding to show dialog events
   */
  forms?: React.FC<ITableFormProps> | null;

  /**
   * Action when clicking anywhere on a row
   */
  onRowClick: (props: IRowClickProps) => void;

  /**
   * Style of a row
   */
  rowStyle: (props: IRowStyleProps) => CSSProperties;

  /**
   * Optional cell custom render component
   */
  cellComponent?: React.FC<ICellProps> | undefined;
}
