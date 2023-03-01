export enum SideMenuNodeType {
  case = 1,
  view = 2,
  savedResult = 3,
}

// N.B. match order of top level nodes for indexing
export enum MenuTreeNodeType {
  page = 1,
  case = 2,
  savedResult = 3,
  view = 4,
  standard = 5,
}

export enum TemplateTreeNodeType {
  template = 1,
  view = 2,
}

export enum NodeType {
  menu = 1,
  tab,
  folder
}

export class TreeNode {
  id: number;
  name: string;
  children?: TreeNode[];
  rowId: number;
  icon?: string;
  type?: SideMenuNodeType | MenuTreeNodeType | TemplateTreeNodeType;
  isOwner?: boolean;
  fixed?: boolean;
  color?: string;
  nodeType?: NodeType;
  folderId?:number;
}

export type ConfirmItem ={
  title:string;
  rowId:number;
  nodeType:MenuTreeNodeType | TemplateTreeNodeType;
}