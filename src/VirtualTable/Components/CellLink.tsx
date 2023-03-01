import { Link } from "@mui/material";
import React from "react";
import { ICellInvestigation, ICellLink, ICellProps, LinkType } from "./ICellProps";
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  default: {
    color: theme.palette.link.main,
  },
}));

export const CellInvestigation: React.FC<ICellProps & ICellInvestigation> = (
  props
): JSX.Element | null => {
  const { rowData, dataSource, referenceColumn, column } = props;
  if (rowData[referenceColumn] === undefined) return <>{rowData[column.name]}</>;

  return (
    <CellLink
      {...props}
      href={`investigation/${dataSource}/${rowData[referenceColumn]}`}
      linkType={LinkType.Base}
    />
  );
};

export const CellLink: React.FC<ICellProps & ICellLink> = (props): JSX.Element | null => {
  const { rowData, column, displayColumn, href, target, linkType } = props;
  const value = rowData[column.name];
  if (column?.name !== displayColumn) return <>{value}</>;

  const classes = useStyles();

  const url =
    linkType === LinkType.External
      ? href
      : linkType === LinkType.Value
      ? value
      : linkType === LinkType.Base
      ? `${location.origin}/${href}`
      : "";

  return (
    <>
      <Link
        href={url}
        target={target}
        onClick={(e) => e.stopPropagation()}
        className={classes.default}
      >
        {value}
      </Link>
    </>
  );
};
