import { alpha, Theme } from "@mui/material";
import { CSSProperties } from "react";
import { Index } from "react-virtualized";
import { TableEnum } from "../../Model/iTechRestApi/TableEnum";
import SelectedGridRowType from "../../Model/Types/selectedGridRowType";

export interface IRowStyleProps {
  row: Index;
  rowData: any | undefined;
  theme: Theme;
  selectedRow?: SelectedGridRowType | undefined;
  selectedId?: any;
  dataSource?: TableEnum;
}

export const DefaultRowStyle = (props: IRowStyleProps): CSSProperties => {
  return RowStyle({ ...props, selectedId: props.selectedRow?.gid });
};

export const RowStyle = ({
  dataSource,
  row,
  rowData,
  selectedRow,
  selectedId,
  theme,
}: IRowStyleProps): CSSProperties => {
  if (
    dataSource !== undefined &&
    selectedRow?.datasource === TableEnum[dataSource] &&
    row?.index >= 0 &&
    rowData?.gid === selectedId
  ) {
    return {
      backgroundColor: theme.palette.primary.main,
    };
  }
  const description = rowData?.taskTypeDescription;
  if (description?.indexOf("Header") > 0 || description?.indexOf("Root") >= 0)
    return { backgroundColor: alpha(theme.palette.notification.main, 0.4) };
  return {};
};

export const DisabledStyle = ({ rowData, theme }: IRowStyleProps): CSSProperties => {
  const disabled = rowData?.disabled === true;
  if (disabled) return { backgroundColor: alpha(theme.palette.warning.main, 0.4) };
  return {};
};
