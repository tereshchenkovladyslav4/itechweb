"use strict";

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
  Children,
} from "react";
import { trackPromise } from "react-promise-tracker";
import useIsMounted from "../_helpers/hooks/useIsMounted";
import useAsyncError from "../_helpers/hooks/useAsyncError";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./CollectionTotalGridStyle.css";

import makeStyles from "@mui/styles/makeStyles";
import { Theme } from "@mui/material/styles";
import { RowData, List } from "../Model/iTechRestApi/AdvancedGrid";
import { graphService } from "../_services/graphService";

declare module "@mui/system" {
  //eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

const useStyles = makeStyles((theme) => ({
  header: { backgroundColor: theme.palette.primary.main },
  boldCell: { fontWeight: "bold" },
}));

// const classes = useStyles();
//   const [count, setCount] = useState<AdvancedGrid>();

export default function Component() {
  const classes = useStyles();
  const isMounted = useIsMounted();
  const throwError = useAsyncError();
  const [tableDetails, setTableDetails] = useState<RowData>();

  useEffect(() => {
    trackPromise<RowData>(graphService.getSimpleTable(), "...loading")
      .then((result) => {
        if (!isMounted()) return;
        setTableDetails(result);
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        throwError(new Error(error?.message || error));
      });
  }, []);

  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  //console.log(tableDetails?.rowData);

  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      resizable: true,
    };
  }, []);

  const autoGroupColumnDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 280,
    };
  }, []);

  const onGridReady = (params: any) => {
    console.log("grid ready");
  };

  const newRowData = tableDetails?.rowData?.map((x) => ({
    [x.dateCreated]: x.fileTypeCount,
    globalID: x.globalID,
    globalName: x.globalName,
    fileTypeDescription: x.fileTypeDescription,
    hour: x.hour
  }));
  console.log(newRowData);

  function isAmber(oldValue: number, newValue: number ) {
    const differences = newValue - oldValue;
    const expected = Math.ceil(differences * 0.45);
    if (newValue <= expected) {
      return true;
    }
    return false;
  }

  function isRed(oldValue: number, newValue: number ) {
    const differences = newValue - oldValue;
    if (newValue == 0) {
      return true;
    }
    return false;
  }

  return (
    <div style={containerStyle}>
      <div style={gridStyle} className="ag-theme-alpine">
        <AgGridReact
          rowData={newRowData}
          columnDefs={tableDetails?.dateColumn}
          //rowData={testRowData}
          //columnDefs={testColumnDef}
          defaultColDef={defaultColDef}
          groupHeaderHeight={75}
          headerHeight={150}
          floatingFiltersHeight={50}
          pivotGroupHeaderHeight={50}
          pivotHeaderHeight={100}
          onGridReady={onGridReady}
          groupDefaultExpanded={0}
          //groupHideOpenParents={true}
          animateRows={true}
          autoGroupColumnDef={autoGroupColumnDef}
        ></AgGridReact>
      </div>
    </div>
  );
}



// const testRowData = [
//   {
//     globalID: 250008,
//     "2023-01-17": 66,
//     globalName: "TCI",
//     fileTypeDescription: "Email ",
//   },
//   {
//     globalID: 250008,
//     "2023-01-18": 57,
//     globalName: "TCI",
//     fileTypeDescription: "Email ",
//   },
//   {
//     globalID: 250008,
//     "2023-01-16": 1,
//     globalName: "TCI",
//     fileTypeDescription: "WhatsAppIm",
//   },
//   {
//     globalID: 250008,
//     "2023-01-16": 7,
//     globalName: "Demo",
//     fileTypeDescription: "WhatsAppIm",
//   },
//   {
//     globalID: 250008,
//     "2023-01-22": 13,
//     globalName: "Demo",
//     fileTypeDescription: "WhatsAppIm",
//   },
//   {
//     globalID: 250008,
//     "2023-01-22": 2,
//     globalName: "Demo",
//     fileTypeDescription: "EE Mobile Voice",
//   },
//   {
//     globalID: 250008,
//     "2023-01-16": 22,
//     globalName: "Demo",
//     fileTypeDescription: "Email",
//   },
// ];

// const testColumnDef = [
//   {
//     headerName: "Collection Total Table",
//     children: [
//       {
//         field: "globalName",
//         width: 150,
//         //suppressSizeToFit: true,
//         enableRowGroup: true,
//         rowGroupIndex: 0,
//       },
//       {
//         field: "fileTypeDescription",
//         width: 150,
//         suppressSizeToFit: true,
//         enableRowGroup: true,
//         rowGroupIndex: 1,
//       },
//       {
//         field: "2023-01-16",
//         width: 60,
//         enableValue: true,
//         suppressMenu: true,
//         enableRowGroup: true,
//         //volatile: true,
//         suppressMovable: true,
//         cellClassRules: {
//           "red": 'isRed(7,x)',
//           "amber": 'isAmber(10,x)',
//           "green": (params: { value: number }) => params.value < 20
//         },
//         filter: "agNumberColumnFilter",
//         aggFunc: "sum",
//       },
//       {
//         field: "2023-01-17",
//         width: 60,
//         enableValue: true,
//         suppressMenu: true,
//         enableRowGroup: true,
//         filter: "agNumberColumnFilter",
//         aggFunc: "sum",
//       },
//       {
//         field: "2023-01-18",
//         width: 60,
//         enableValue: true,
//         suppressMenu: true,
//         enableRowGroup: true,
//         //volatile: true,
//         suppressMovable: true,
//         cellClassRules: {'bold-and-red': 'x>1'},
//         filter: "agNumberColumnFilter",
//         aggFunc: "sum",
//       },
//       {
//         field: "2023-01-22",
//         width: 60,
//         enableValue: true,
//         suppressMenu: true,
//         enableRowGroup: true,
//         filter: "agNumberColumnFilter",
//         aggFunc: "sum",
//       },
//     ],
//   },
// ];