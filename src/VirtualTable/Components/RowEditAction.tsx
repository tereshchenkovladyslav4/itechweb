import React from "react";
import { PropTypes } from "@mui/material";
import { useStore } from "../../_context/Store";
import IRowActionProps from "./IRowActionProps";
import SelectedCaseMenu from "../SelectedCaseMenu";
import EditableObjectMenu from "../EditableObjectMenu";
import { DialogType } from "../VirtualTable.actions";
import { MenuAction } from "../../Menu/MenuFunction";

const _getSimRowId = (rowData: any) => {
  if (!rowData) return undefined;
  if (rowData["iTechSimRowId"]) return String(rowData["iTechSimRowId"]);
  if (rowData["iTechLinkedRowId"] && rowData["iTechControlTableReferenceTypeRowId"] === 7)
    return String(rowData["iTechLinkedRowId"]);

  return undefined;
};

interface IRowEditActionProps {
  editAction: DialogType;
  removeAction: DialogType;
  menuActions?: MenuAction[];
}

type Props = IRowActionProps & IRowEditActionProps;

const RowEditAction: React.FC<Props> = ({
  rowData,
  dataSource,
  selectOnClick,
  showDialog,
  editAction,
  removeAction,
  menuActions,
}: Props) => {
  const { selectors } = useStore();
  const item = selectors.getSelectedGridRow();
  const caseReference = String(rowData["caseReference"]);
  const gid = String(rowData["gid"]);

  let color: PropTypes.Color = "primary";
  if (item !== undefined) {
    color =
      dataSource === item.datasource &&
      (String(item.gid) === gid || String(item.currentSelected?.gid) === gid)
        ? "secondary"
        : "primary";
  }

  if (caseReference !== "undefined" && caseReference !== "null" && !rowData["iTechLinkedRowId"]) {
    return <SelectedCaseMenu caseReference={caseReference} color={color} />;
  }

  return !_getSimRowId(rowData) && showDialog ? (
    <EditableObjectMenu
      color={color}
      gid={gid}
      edit={() => selectOnClick(gid, rowData).then(() => showDialog(editAction))}
      remove={() => selectOnClick(gid, rowData).then(() => showDialog(removeAction))}
      menuActions={menuActions}
    />
  ) : null;
};

export default RowEditAction;
