import React from "react";
import { Button, Tooltip } from "@mui/material";
import { TableEnum } from "../../Model/iTechRestApi/TableEnum";
import { ITableFunctionProps } from "../Components/ITableFunctionProps";
import { DialogType, TableActionId } from "../VirtualTable.actions";
import BaseTableConfig from "./BaseTableConfig";
import { ITableActionProps } from "../Components/ITableActionProps";
import { MenuAction } from "../../Menu/MenuFunction";
import IconManager from "../../_components/IconManager";
import { ITableFormProps } from "../Components/ITableFormProps";
import { AddDpiaV2Dlg } from "../../Actions/DPIA/DPIAV2";
// import AddToCaseDlg from "../AddToCaseDlg";
// import { QuerySet } from "../../Model/Types/QuerySet";
import AddToCaseFilterDlg from "../AddToCaseFilter";
import { AddRopaDlg } from "../../Actions/DPIA/Ropa";
import { AddRopaMappingDlg } from "../../Actions/DPIA/RopaMapping";

export default class ITechWebCaseManagementConfig extends BaseTableConfig {
  constructor() {
    super(TableEnum.iTechWebCaseManagement);
    this.hideCheckBox = true;
  }

  tableFunctions = ({ setShowDialog }: ITableFunctionProps): JSX.Element => {
    return (
      <Tooltip title="New Case" placement="left">
        <span>
          <Button
            onClick={() => setShowDialog(DialogType.addCase)}
            variant="contained"
            color="primary"
            style={{ margin: "0 10px" }}
          >
            Create New
          </Button>
        </span>
      </Tooltip>
    );
  };

  tableActions = (props: ITableActionProps): MenuAction[] => {
    const tableActions: MenuAction[] = super.tableActions(props);
    const { setShowDialog } = props;
    tableActions.push({
      icon: <IconManager fontSize="small" icon="Add" />,
      name: "Add Dpia ",
      id: TableActionId.addDpiaV2,
      toolTipPlacement: "left-end",
      onClick: () => setShowDialog(DialogType.addDpiaV2),
    });
    tableActions.push({
      icon: <IconManager fontSize="small" icon="Add" />,
      name: "Add Ropa ",
      id: TableActionId.addRopa,
      toolTipPlacement: "left-end",
      onClick: () => setShowDialog(DialogType.addRopa),
    });
    tableActions.push({
      icon: <IconManager fontSize="small" icon="Add" />,
      name: "Add Data Map",
      id: TableActionId.addRopaMapping,
      toolTipPlacement: "left-end",
      onClick: () => setShowDialog(DialogType.addRopaMapping),
    });

    return tableActions;
  };

  forms = (props: ITableFormProps): JSX.Element => {
    const {
      showDialog,
      setShowDialog,
      iTechControlTableRowId,
    } = props;

    return (
      <>
        <AddDpiaV2Dlg
          show={showDialog === DialogType.addDpiaV2}
          setShow={(show: boolean) => setShowDialog(show ? DialogType.addDpiaV2 : DialogType.none)}
        />
        <AddRopaDlg
          show={showDialog === DialogType.addRopa}
          setShow={(show: boolean) => setShowDialog(show ? DialogType.addRopa : DialogType.none)}
        />
        <AddRopaMappingDlg
          show={showDialog === DialogType.addRopaMapping}
          setShow={(show: boolean) => setShowDialog(show ? DialogType.addRopaMapping : DialogType.none)}
        />
         <AddToCaseFilterDlg
          show={showDialog === DialogType.addToCaseFilter}
          setShow={(show: boolean) =>
            setShowDialog(show ? DialogType.addToCaseFilter : DialogType.none)
          }
          dataSource={TableEnum[this.dataSource]}
          iTechControlTableRowId={iTechControlTableRowId}
        />
      </>
    );
  };
}
