import React, { Component, CSSProperties, useState } from "react";
import { TableEnum } from "../../Model/iTechRestApi/TableEnum";
import { RowAction } from "../Components/RowAction";
import { DefaultAction, IRowClickProps } from "../RowClickAction";
import { DefaultRowStyle, IRowStyleProps } from "../Components/RowStyle";
import { ITableFormProps } from "../Components/ITableFormProps";
import { ITableActionProps } from "../Components/ITableActionProps";
import { MenuAction } from "../../Menu/MenuFunction";
import { DialogType, TableActionId } from "../VirtualTable.actions";
import IconManager from "../../_components/IconManager";
import ITableConfig from "./ITableConfig";
import IRowActionProps from "../Components/IRowActionProps";
import SaveResultsDlg from "../SaveResultsDlg";
import AddToCaseDlg from "../AddToCaseDlg";
import { QuerySet } from "../../Model/Types/QuerySet";
import { AuditType } from "../../Model/Extended/ITechResultRow";
import { resultsService } from "../../_services/resultsService";
import { ITechWebResultSet } from "../../Model/iTechRestApi/ITechWebResultSet";
import { trackPromise } from "react-promise-tracker";
import { AddSavedResultEvent, trigger } from "../../_helpers/events";
import AddToCaseFilterDlg from "../AddToCaseFilter";
import AddAlertDlg from "../AddAlertDlg";
import { ICellProps } from "../Components/ICellProps";

export default class BaseTableConfig
  extends Component<{ dataSource: TableEnum }>
  implements ITableConfig
{
  dataSource: TableEnum;
  hideCheckBox: boolean;
  preventSelection: boolean;
  disableTableActionMenu: boolean;
  rowActionComponent?: React.FC<IRowActionProps> | null;
  onRowClick: (props: IRowClickProps) => void;
  rowStyle: (props: IRowStyleProps) => CSSProperties;
  cellComponent?: React.FC<ICellProps> | undefined;

  constructor(dataSource: TableEnum) {
    super({ dataSource });
    this.dataSource = dataSource;
    this.hideCheckBox = false;
    this.preventSelection = false;
    this.disableTableActionMenu = false;
    this.rowActionComponent = (props) => (
      <RowAction {...props} dataSource={TableEnum[dataSource]} />
    );
    this.onRowClick = async (props) => await DefaultAction(props);
    this.rowStyle = (props) => DefaultRowStyle({ ...props, dataSource: this.dataSource });
    this.cellComponent = undefined;
  }

  forms({
    checkedRows,
    allChecked,
    showDialog,
    setShowDialog,
    searchText,
    expressions,
    iTechControlTableRowId,
    setupRowId,
  }: ITableFormProps): JSX.Element {
    const [currentResultSet, setCurrentResultSet] = useState<any>({});
    const _saveResultsDlgArea = "saveResutsDlg";

    const saveResultSet = (isNew: boolean, name: string) => {
      const gids = checkedRows;

      const newResultSet = {
        name,
        iTechControlTableRowId,
        results: gids.map((x) => {
          const rowId = parseInt(x);
          if (isNaN(rowId)) {
            const gidparts = x.split("-");
            const id = parseInt(gidparts[1]);
            // sets enum for sim / data for audit types ( to determine context )
            return {
              iTechSimRowId: id,
              auditType: gidparts[0].toLowerCase() === "sim" ? AuditType.sim : AuditType.data,
            };
          }
          return { iTechSimRowId: rowId };
        }),
        rowId: isNew ? 0 : currentResultSet?.rowId || 0,
        securityRowId: 0, // ignored by server on save.
      } as ITechWebResultSet;

      if (allChecked) {
        if (TableEnum[this.dataSource].endsWith("SavedResults"))
          newResultSet.savedResultSetRowId = setupRowId;

        trackPromise(
          resultsService.saveAllChecked(newResultSet, { expressions, searchText } as QuerySet),
          _saveResultsDlgArea
        ).then((x) => {
          setCurrentResultSet(x);
          setShowDialog(DialogType.none);
          if (isNew) trigger(AddSavedResultEvent);
        });
      } else {
        if (isNew) {
          trackPromise(resultsService.add(newResultSet), _saveResultsDlgArea).then((x) => {
            setCurrentResultSet(x);
            setShowDialog(DialogType.none);

            trigger(AddSavedResultEvent);
          });
        } else {
          // update current set
          trackPromise(
            resultsService.update(currentResultSet.rowId, newResultSet),
            _saveResultsDlgArea
          ).then(() => {
            setShowDialog(DialogType.none);
          });
        }
      }
    };

    return (
      <>
        <SaveResultsDlg
          text={currentResultSet?.name}
          show={showDialog === DialogType.saveResults}
          setShow={(show: boolean) =>
            setShowDialog(show ? DialogType.saveResults : DialogType.none)
          }
          onSave={saveResultSet}
          canUpdate={true}
        />
        <AddToCaseDlg
          show={showDialog === DialogType.addCase}
          setShow={(show: boolean) => setShowDialog(show ? DialogType.addCase : DialogType.none)}
          allChecked={allChecked}
          rowIds={checkedRows}
          iTechControlTableRowId={iTechControlTableRowId}
          filter={allChecked ? ({ searchText, expressions } as QuerySet) : undefined}
        />
        <AddToCaseFilterDlg
          show={showDialog === DialogType.addToCaseFilter}
          setShow={(show: boolean) =>
            setShowDialog(show ? DialogType.addToCaseFilter : DialogType.none)
          }
          dataSource={TableEnum[this.dataSource]}
          iTechControlTableRowId={iTechControlTableRowId}
        />
        <AddAlertDlg
          show={showDialog === DialogType.addAlert}
          setShow={(show: boolean) => setShowDialog(show ? DialogType.addAlert : DialogType.none)}
          allChecked={allChecked}
          rowIds={checkedRows}
          iTechControlTableRowId={iTechControlTableRowId}
          filter={allChecked ? ({ searchText, expressions } as QuerySet) : undefined}
        />
      </>
    );
  }

  /*
   *  These are added to every data source by default
   *  If they are not required this method must be overridden by the child class and return an empty array or set disableTableActionMenu = true
   *  If both these actions and new specific actions are required the child array should be merged with [...super.tableActions(props)]
   */
  tableActions({
    setShowDialog,
    checkedRows,
    allChecked,
    caseId,
  }: ITableActionProps): MenuAction[] {
    const tableActions: MenuAction[] = [];

    if (caseId) {
      tableActions.push({
        icon: <IconManager fontSize="small" icon="Add" />,
        name: "Add to Case",
        id: TableActionId.addToCaseFilter,
        toolTipPlacement: "left-end",
        onClick: () => setShowDialog(DialogType.addToCaseFilter),
      });
    }

    if (checkedRows.length > 0 || allChecked) {
      tableActions.push({
        icon: <IconManager fontSize="small" icon="SaveAlt" />,
        name: "Save Results",
        id: TableActionId.saveResults,
        toolTipPlacement: "left-end",
        onClick: () => setShowDialog(DialogType.saveResults),
      });
      tableActions.push({
        icon: <IconManager fontSize="small" icon="WorkOutline" />,
        name: "Add selected item(s) to a case",
        id: TableActionId.addToCase,
        toolTipPlacement: "left-end",
        onClick: () => setShowDialog(DialogType.addCase),
      });
    }

    if (checkedRows.length === 1) {
      tableActions.push({
        icon: <IconManager fontSize="small" icon="AddAlert" />,
        name: "Raise alert on item",
        id: TableActionId.addAlert,
        toolTipPlacement: "left-end",
        onClick: () => setShowDialog(DialogType.addAlert),
      });
    }

    return tableActions;
  }

  HideCheckBox(value: boolean | undefined): ITableConfig {
    if (value) this.hideCheckBox = value;
    return this;
  }

  PreventSelection(value: boolean | undefined): ITableConfig {
    if (value) this.preventSelection = value;
    return this;
  }

  DisableTableActionMenu(value: boolean | undefined): ITableConfig {
    if (value) this.disableTableActionMenu = value;
    return this;
  }
}
