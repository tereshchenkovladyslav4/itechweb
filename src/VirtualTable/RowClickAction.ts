import React from "react";
import { hasPreviewOrProperties, onOpenFullscreen } from "../_helpers/fileActions";
import { showHiddenAction } from "../_context/actions/HiddenActions";
import { DialogType } from "./VirtualTable.actions";

export interface IRowClickProps {
  rowData: any;
  dispatch: React.Dispatch<any>;
  selectOnClick: (gid: any, rowData: any) => Promise<void>;
  showDialog: (dialog: DialogType) => void;
}

export const RowClickDialogAction = (
  { selectOnClick, rowData, showDialog }: IRowClickProps,
  dialog: DialogType
): void => {
  selectOnClick(rowData.gid, rowData).then(() => showDialog(dialog));
};

export const DefaultAction = (props: IRowClickProps): void | Promise<void> => {
  const { rowData, dispatch, selectOnClick } = props;

  const caseReference = String(rowData["caseReference"]);
  const gid = rowData["iTechLinkedRowId"]
    ? String(String(rowData["iTechLinkedRowId"]))
    : String(rowData["gid"]);

  if (caseReference !== "undefined" && caseReference !== "null" && !rowData["iTechLinkedRowId"]) {
    return new Promise(() => {
      window.open(
        `${window.location.origin.toString()}/cases/${caseReference
          .toLowerCase()
          .replace(" ", "_")}/`, // TODO: modify router to dynamically find case folder/path using this "case" indicator
        "_blank"
      );
    });
  }

  return hasPreviewOrProperties(rowData?.filterGroupColor)
    ? selectOnClick(gid, rowData)
    : onOpenFullscreen(gid, () => dispatch(showHiddenAction(true)), selectOnClick, rowData);
};
