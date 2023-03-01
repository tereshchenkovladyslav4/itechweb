import React from "react";
import { Tooltip } from "@mui/material";
import { GetApp } from "@mui/icons-material";
import { trackPromise } from "react-promise-tracker";
import BusyIconButton from "../../_components/BusyIconButton";
import { dataService } from "../../_services/dataService";
import { ITableFunctionProps } from "../Components/ITableFunctionProps";

export const ExportDataButton = ({
  numberOfResultsFound,
  querySet,
  dataSource,
}: ITableFunctionProps): JSX.Element => {
  const fileExportArea = "fileExport";

  const _exportData = () => {
    return dataSource && trackPromise(dataService.fileExport(dataSource, querySet), fileExportArea);
  };

  return (
    <Tooltip title="Export as CSV" placement="left">
      <span>
        <BusyIconButton
          color="primary"
          onClick={_exportData}
          disabled={!numberOfResultsFound || numberOfResultsFound > 60_000}
          area={fileExportArea}
          style={{ margin: "0 10px" }}
        >
          <GetApp />
        </BusyIconButton>
      </span>
    </Tooltip>
  );
};
