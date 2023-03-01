import React from "react";
import { TableEnum } from "../../Model/iTechRestApi/TableEnum";
import { ITableFormProps } from "../Components/ITableFormProps";
import { ReferencedSimRowAction } from "../Components/RowAction";
import { DialogType, TableActionId } from "../VirtualTable.actions";
import BaseTableConfig from "./BaseTableConfig";
import FileUploadDlg from "../FileUploadDlg";
import { ITableActionProps } from "../Components/ITableActionProps";
import IconManager from "../../_components/IconManager";
import { MenuAction } from "../../Menu/MenuFunction";

export default class ITechWebSimUploadConfig extends BaseTableConfig {
  constructor() {
    super(TableEnum.iTechWebSimUpload);
    this.rowActionComponent = (props) => <ReferencedSimRowAction {...props} />;
  }

  forms = ({ showDialog, setShowDialog }: ITableFormProps): JSX.Element => {
    return (
      <FileUploadDlg
        show={showDialog === DialogType.fileUpload}
        setShow={(show: boolean) => setShowDialog(show ? DialogType.fileUpload : DialogType.none)}
      />
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
