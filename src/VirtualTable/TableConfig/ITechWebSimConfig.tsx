import React from "react";
import { TableEnum } from "../../Model/iTechRestApi/TableEnum";
import { ITableFormProps } from "../Components/ITableFormProps";
import { DialogType, TableActionId } from "../VirtualTable.actions";
import BaseTableConfig from "./BaseTableConfig";
import FileUploadDlg from "../FileUploadDlg";
import { MenuAction } from "../../Menu/MenuFunction";
import IconManager from "../../_components/IconManager";
import { ITableActionProps } from "../Components/ITableActionProps";
import { CellInvestigation } from "../Components/CellLink";

export default class ITechWebSimConfig extends BaseTableConfig {
  constructor() {
    super(TableEnum.iTechWebSim);
    // TODO: requirement of owner rowId col forces dedupe of SIM data
    this.cellComponent = (props) => (
      <CellInvestigation
        {...props}
        displayColumn="owner"
        dataSource="user"
        referenceColumn="iTechDataOwnerUserRowId"
        target="_blank"
      />
    );
  }

  forms = (props: ITableFormProps): JSX.Element => {
    const { showDialog, setShowDialog } = props;
    return (
      <>
        {super.forms(props)}
        <FileUploadDlg
          show={showDialog === DialogType.fileUpload}
          setShow={(show: boolean) => setShowDialog(show ? DialogType.fileUpload : DialogType.none)}
        />
      </>
    );
  };

  tableActions = (props: ITableActionProps): MenuAction[] => {
    const { setShowDialog } = props;
    const tableActions = [...super.tableActions(props)];

    return [
      ...tableActions,
      {
        icon: <IconManager fontSize="small" icon="Publish" />,
        name: "File Upload",
        id: TableActionId.fileUpload,
        toolTipPlacement: "left-end",
        onClick: () => setShowDialog(DialogType.fileUpload),
      },
    ];
  };
}
