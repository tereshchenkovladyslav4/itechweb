import { HTMLAttributeAnchorTarget } from "react";

export enum LinkType {
  External,
  Base,
  Value,
}

export interface ICellProps {
  rowData: any;
  column: any;
}

export interface ICellInvestigation {
  displayColumn: string;
  dataSource: string;
  referenceColumn: string;
  target?: HTMLAttributeAnchorTarget;
}

export interface ICellLink {
  displayColumn: string;
  href?: string;
  linkType: LinkType;
  target?: HTMLAttributeAnchorTarget;
}

export interface ICellIcon {
  referenceColumn: string;
}
