import React from "react";
import { PropTypes } from "@mui/material";
import { useStore } from "../../_context/Store";
import { MenuAction } from "../../Menu/MenuFunction";
import { showHiddenAction } from "../../_context/actions/HiddenActions";
import { hasPreviewOrProperties, onOpenFullscreen } from "../../_helpers/fileActions";
import { useHistory } from "react-router";
import { defaultMenu, fullScreen, menuActionBuilder, newTab, openItem } from "./MenuActionBuilder";
import IRowActionProps from "./IRowActionProps";
import SelectedCaseMenu from "../SelectedCaseMenu";
import SelectedRowMenu from "../SelectedRowMenu";

const _getSimRowId = (rowData: any) => {
  if (!rowData) return undefined;
  if (rowData["iTechSimRowId"]) return String(rowData["iTechSimRowId"]);
  if (rowData["iTechLinkedRowId"] && rowData["iTechControlTableReferenceTypeRowId"] === 7)
    return String(rowData["iTechLinkedRowId"]);

  return undefined;
};

/**
 * Default row action config
 */
const RowAction: React.FC<IRowActionProps> = (props: IRowActionProps) => {
  const { rowData, dataSource, selectOnClick } = props;

  const { dispatch } = useStore();
  const history = useHistory();
  const selectedItem = String(rowData["gid"]);
  const actions = defaultMenu(selectedItem, selectOnClick, rowData, dispatch, history, dataSource);

  return <SpecifiedRowAction {...props} selectedItem={selectedItem} actions={actions} />;
};

/**
 * Row which contains iTechSimRowId column referencing a SIM file - see iTechWebSimUpload
 */
const ReferencedSimRowAction: React.FC<IRowActionProps> = (props: IRowActionProps) => {
  const { rowData, dataSource, selectOnClick } = props;

  const { dispatch } = useStore();
  const history = useHistory();
  const selectedItem = String(rowData["gid"]); // we still need this to select the actual row rather than a non-existant SIM row
  const simRowId = _getSimRowId(rowData);
  const actions = [
    openItem(selectedItem, selectOnClick, rowData),
    fullScreen(selectedItem, selectOnClick, rowData, dispatch),
  ];
  if (simRowId) actions.push(newTab(history, simRowId, dataSource));

  return (
    <SpecifiedRowAction
      {...props}
      selectedItem={selectedItem}
      actions={menuActionBuilder(actions)}
    />
  );
};

export interface ISpecifiedProps {
  selectedItem: string;
  actions: MenuAction[];
}

type Props = IRowActionProps & ISpecifiedProps;

/**
 * Default row actions with extra props to define a selected item and the menu actions
 */
const SpecifiedRowAction: React.FC<Props> = ({
  rowData,
  dataSource,
  selectOnClick,
  selectedItem,
  actions,
}: Props) => {
  const { selectors, dispatch } = useStore();
  const item = selectors.getSelectedGridRow();
  const caseReference = String(rowData["caseReference"]);

  let color: PropTypes.Color = "primary";
  if (item !== undefined) {
    color =
      dataSource === item.datasource &&
      (String(item.gid) === selectedItem || String(item.currentSelected?.gid) === selectedItem)
        ? "secondary"
        : "primary";
  }

  if (caseReference !== "undefined" && caseReference !== "null" && !rowData["iTechLinkedRowId"]) {
    return <SelectedCaseMenu caseReference={caseReference} color={color} />;
  }

  if (actions.length === 0) return null;

  return selectedItem ? (
    <SelectedRowMenu
      actions={actions}
      gid={selectedItem}
      filterGroupColor={rowData?.filterGroupColor}
      defaultAction={() =>
        hasPreviewOrProperties(rowData?.filterGroupColor)
          ? selectOnClick(selectedItem, rowData)
          : onOpenFullscreen(selectedItem, () => dispatch(showHiddenAction(true)), selectOnClick)
      }
      color={color}
    />
  ) : null;
};

export { RowAction, SpecifiedRowAction, ReferencedSimRowAction };
