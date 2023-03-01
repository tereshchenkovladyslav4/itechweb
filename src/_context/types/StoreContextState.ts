import SelectedGridRowType from "../../Model/Types/selectedGridRowType";
import { ITechDataWebTemplate } from "../../Model/iTechRestApi/ITechDataWebTemplate";
import { AdvancedFilterModel } from "../../Model/iTechRestApi/AdvancedFilterModel";
import { SimVersion } from "../../Model/iTechRestApi/SimVersion";
import { ITechDataWebMenuExtended } from "../../Model/Extended/ITechDataWebMenuExtended";
import { CaseModel } from "../../Model/iTechRestApi/CaseModel";
import { ITechControlTable } from "../../Model/iTechRestApi/ITechControlTable";
import { ITechDataWebFolderExtended } from "../../Model/Extended/ITechDataWebFolderExtended";
import { FilterGroup } from "../../Model/Types/FilterGroup";

export type StoreContextState = {
  pageData: Map<number, PageDataType>;
  errorData: IErrorData;
  templates: ITechDataWebTemplate[];
  menuList: Array<ITechDataWebMenuExtended>;
  showHidden: boolean;
  selectedCase: CaseModel | undefined;
  dataSources: Array<ITechControlTable>;
  folderList: Array<ITechDataWebFolderExtended>;
};

export type GroupFilters = Map<FilterGroup, AdvancedFilterModel>;

export type PageDataType = {
  selectedVersion?: SimVersion;
  data: SelectedGridRowType;
  appliedFilters?: GroupFilters;
  appliedTreeFilters?: GroupFilters;
  appliedGraphFilters?: GroupFilters;
};

export interface IErrorData {
  showDialog: boolean;
  componentName: string;
  error: any;
  errorInfo: any;
}
