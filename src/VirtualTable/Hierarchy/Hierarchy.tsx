import { Alert } from "@mui/material";
import React from "react";
import Waiting from "../../_components/Waiting";
import { getInvestigationId } from "../../_helpers/helpers";
import ITechWebHrConfig from "../TableConfig/ITechWebHrConfig";
import VirtualTable from "../VirtualTable";
import { dataService } from "../../_services/hierarchyService";
import { CellInvestigation } from "../Components/CellLink";

interface IHierarchyProps {
  area: string;
  configUpdate(arg: any): any;
  updateData(arg: any): any;
  data: any;
}

// Fixed initial config for columns to display
const config: any = {
  name: "iTechWebHierarchy",
  description: "HR",
  icon: "FolderShared",
  subItems: [
    {
      rowId: 690,
      iTechControlColumnTypeRowId: 9,
      name: "userName",
      description: "User",
      gridIndex: 2,
      gridSelected: true,
      minWidth: 70,
      helperText: "Text",
    },
    {
      rowId: 726,
      iTechControlColumnTypeRowId: 9,
      name: "roleName",
      description: "Role",
      gridIndex: 21,
      gridSelected: true,
      minWidth: 70,
      helperText: "Text",
    },
    {
      rowId: 720,
      iTechControlColumnTypeRowId: 4,
      name: "riskRating",
      description: "Risk Rating",
      gridIndex: 18,
      gridSelected: true,
      minWidth: 70,
      helperText: "Number",
    },
    {
      rowId: 729,
      iTechControlColumnTypeRowId: 9,
      name: "roleLocation",
      description: "Role Location",
      gridIndex: 23,
      gridSelected: true,
      minWidth: 70,
      helperText: "Text",
    },
    {
      rowId: 740,
      iTechControlColumnTypeRowId: 9,
      name: "roleType",
      description: "Role Type",
      gridIndex: 30,
      gridSelected: null,
      minWidth: 70,
      helperText: "Text",
    },
    {
      rowId: 722,
      iTechControlColumnTypeRowId: 9,
      name: "roleStartDateString",
      description: "Role Start Date",
      gridIndex: 19,
      gridSelected: true,
      minWidth: 70,
      helperText: "yyyy-MM-dd HH:mm:ss",
    },
  ],
};

export enum HierarchyType {
  Senior = 0,
  Subordinate = 1,
}

const Hierarchy: React.FC<IHierarchyProps> = ({ area, configUpdate, updateData, data }) => {
  const investigation = getInvestigationId();
  const { hierarchyType } = data.data;

  if (!investigation || investigation.datasource !== "user")
    return (
      <>
        <Alert severity="warning">No user selected for hierarchy view</Alert>
        <Waiting />
      </>
    );

  const tableConfig = new ITechWebHrConfig();
  tableConfig.hideCheckBox = true;
  tableConfig.preventSelection = true;
  tableConfig.tableActions = () => [];
  tableConfig.onRowClick = () => {};
  tableConfig.cellComponent = (props) => (
    <CellInvestigation
      {...props}
      displayColumn="userName"
      dataSource="user"
      referenceColumn="iTechDataUserRowId"
      target="_blank"
    />
  );
  config.customName = hierarchyType === HierarchyType.Subordinate ? "Subordinates" : "Reports To";

  return (
    <VirtualTable
      configUpdate={configUpdate}
      updateData={updateData}
      area={area}
      setup={config}
      config={tableConfig}
      service={dataService(hierarchyType === HierarchyType.Senior)}
    />
  );
};

export default Hierarchy;
