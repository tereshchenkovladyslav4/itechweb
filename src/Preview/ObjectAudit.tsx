import React, { useEffect, useState } from "react";
import { iTechControlColumnEnum } from "../Model/iTechRestApi/iTechControlColumnEnum";
import ITechWebAuditConfig from "../VirtualTable/TableConfig/ITechWebAuditConfig";
import VirtualTable from "../VirtualTable/VirtualTable";
import Waiting from "../_components/Waiting";

interface IObjectAuditProps {
  rowId?: number; // rowId of selected file
  area: string;
  configUpdate(arg: any): any;
  updateData(arg: any): any;
  data: any;
}

// Fixed initial config for columns to display
const config: any = {
  description: "Audit",
  icon: "VerifiedUser",
  name: "iTechWebAudit",
  subItems: [
    {
      name: "gid",
      description: "ID",
      operation: "Contains",
      iTechControlColumnTypeRowId: 9,
      gridIndex: 0,
      gridSelected: true,
      minWidth: 70,
      rowId: 25,
      helperText: "Text",
    },
    {
      name: "iTechControlAuditCategoryTypeDescription",
      description: "Category",
      operation: "Contains",
      iTechControlColumnTypeRowId: 9,
      gridIndex: 1,
      gridSelected: true,
      minWidth: 70,
      rowId: 27,
      helperText: "Text",
    },
    {
      name: "iTechControlEventTypeDescription",
      description: "Event Type",
      operation: "Contains",
      iTechControlColumnTypeRowId: 9,
      gridIndex: 2,
      gridSelected: true,
      minWidth: 70,
      rowId: 28,
      helperText: "Text",
    },
    {
      name: "summary",
      description: "Summary",
      operation: "Contains",
      iTechControlColumnTypeRowId: 9,
      gridIndex: 3,
      gridSelected: true,
      minWidth: 70,
      rowId: 32,
      helperText: "Text",
    },
    {
      name: "dateInsertedString",
      description: "Date Inserted",
      operation: "Contains",
      iTechControlColumnTypeRowId: 9,
      gridIndex: 4,
      gridSelected: true,
      minWidth: 70,
      rowId: 26,
      helperText: "yyyy-MM-dd HH:mm:ss",
    },
    {
      name: "iTechDataSecurityObject",
      description: "User",
      operation: "Contains",
      iTechControlColumnTypeRowId: 9,
      gridIndex: 5,
      gridSelected: true,
      minWidth: 70,
      rowId: 31,
      helperText: "yyyy-MM-dd HH:mm:ss",
    },
  ],
};

const ObjectAudit: React.FC<IObjectAuditProps> = ({
  rowId,
  area,
  configUpdate,
  updateData,
  data,
}) => {
  // added as state so that when a different filter group colour virtual table is selected
  // we still display the last selection for this colour group
  const [id, setId] = useState(rowId);

  const auditConfig = new ITechWebAuditConfig();
  auditConfig.hideCheckBox = true;
  auditConfig.preventSelection = true;
  auditConfig.tableActions = () => [];

  useEffect(() => {
    if (rowId) {
      setId(rowId);
    }
  }, [rowId]);

  if (id === undefined) return <Waiting />;

  return (
    <VirtualTable
      configUpdate={configUpdate}
      updateData={updateData}
      area={area}
      setup={data?.subItems ? data : config}
      fixedFilters={[
        {
          name: "iTechSimRowId",
          value: id,
          operation: "Equals",
          iTechControlColumnType: iTechControlColumnEnum.long,
          iTechControlColumnTypeRowId: 5,
          rowId: 0,
          filters: [],
          isLogin: false,
        },
      ]}
      config={auditConfig}
    />
  );
};

export default ObjectAudit;
