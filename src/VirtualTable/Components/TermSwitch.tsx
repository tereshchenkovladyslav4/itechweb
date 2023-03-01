import React from "react";
import { Switch } from "@mui/material";
import { useStore } from "../../_context/Store";
import { termService } from "../../_services/termService";
import { RefreshPreviewEvent, trigger } from "../../_helpers/events";
import { TableEnum } from "../../Model/iTechRestApi/TableEnum";
import IRowActionProps from "./IRowActionProps";

const TermSwitch: React.FC<IRowActionProps> = ({ rowData, refreshTable }: IRowActionProps) => {
  const { selectors } = useStore();
  const caseClosed = selectors.getCaseClosed();
  const datakey = rowData["iTechControlTableReferenceRowId"];
  const gid = rowData["gid"] as number;

  const _updateTermReferences = (gids: number[], add: boolean) => {
    if (add) {
      termService.addReferences(gids).then(refreshTable);
    } else {
      termService.removeReferences(gids).then(refreshTable);
    }
    trigger(RefreshPreviewEvent, { dataSource: TableEnum[TableEnum.iTechWebTask] });
  };

  return selectors.getSelectedCaseId() !== undefined ? (
    <Switch
      checked={!!datakey ?? false}
      onChange={(e) => _updateTermReferences([gid], e.target.checked)}
      name="iTechControlTableReferenceRowId"
      disabled={caseClosed}
    />
  ) : null;
};

export default TermSwitch;
