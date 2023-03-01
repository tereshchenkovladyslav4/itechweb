import React from "react";
import { TableEnum } from "../Model/iTechRestApi/TableEnum";
import { hasPreviewOrProperties, onOpenFullscreen } from "../_helpers/fileActions";
import { showHiddenAction } from "../_context/actions/HiddenActions";

export const DefaultAction = (
  dataSource: string,
  rowData: any,
  action: (() => Promise<void>) | undefined,
  dispatch: React.Dispatch<any>,
  selectOnClick: (gid: any, rowData: any) => Promise<void>
): (() => void) => {
  const caseReference = String(rowData["caseReference"]);
  const gid = rowData["iTechLinkedRowId"]
    ? String(String(rowData["iTechLinkedRowId"]))
    : String(rowData["gid"]);

  let defaultAction = () =>
    hasPreviewOrProperties(rowData?.filterGroupColor)
      ? selectOnClick(gid, rowData)
      : onOpenFullscreen(gid, () => dispatch(showHiddenAction(true)), selectOnClick, rowData);

  if (caseReference !== "undefined" && caseReference !== "null") {
    defaultAction = () => {
      window.open(
        `${window.location.origin.toString()}/cases/${caseReference
          .toLowerCase()
          .replace(" ", "_")}/`, // TODO: modify router to dynamically find case folder/path using this "case" indicator
        "_blank"
      );
    };
  } else if (action !== undefined && !rowData["iTechSimRowId"]) {
    defaultAction = action;
  }

  return defaultAction;
};
