import SelectedGridRowType from "../../Model/Types/selectedGridRowType";
import { PageDataType, StoreContextState } from "../types/StoreContextState";
import { ITechDataWebTemplate } from "../../Model/iTechRestApi/ITechDataWebTemplate";
import { iTechDataWebTemplateEnum } from "../../Model/iTechRestApi/iTechDataWebTemplateEnum";
import { AdvancedFilterModel } from "../../Model/iTechRestApi/AdvancedFilterModel";
import { DataSource } from "../../Model/iTechRestApi/DataSource";
import { SimVersion } from "../../Model/iTechRestApi/SimVersion";
import { CaseModel } from "../../Model/iTechRestApi/CaseModel";
import { ITechDataWebMenuExtended } from "../../Model/Extended/ITechDataWebMenuExtended";
import { ITechControlTable } from "../../Model/iTechRestApi/ITechControlTable";
import { iTechDataCaseStatusEnum } from "../../Model/iTechRestApi/iTechDataCaseStatusEnum";
import { ITechDataWebFolderExtended } from "../../Model/Extended/ITechDataWebFolderExtended";
import { FilterGroup } from "../../Model/Types/FilterGroup";
import { iTechDataWebFilterEnum } from "../../Model/iTechRestApi/iTechDataWebFilterEnum";
import { TableEnum } from "../../Model/iTechRestApi/TableEnum";
import { ITechDataWebTabExtended } from "../../Model/Extended/ITechDataWebTabExtended";

const AppliedDataSources: Map<string, DataSource[]> = new Map(); // to keep the array reference the same.

export type Immutable<T> = {
  readonly [K in keyof T]: Immutable<T[K]>;
};

export const useSelectors = (state: StoreContextState) => ({
  // TODO - this is unused
  getPageData: (): PageDataType | undefined => {
    const tabId = getSelectedTabId(state);
    if (tabId === undefined) return undefined;
    return state.pageData?.get(tabId);
  },
  getSelectedGridRow: (): SelectedGridRowType | undefined => {
    const tabId = getSelectedTabId(state);
    if (tabId === undefined) return undefined;
    return state.pageData?.get(tabId)?.data;
  },
  getSelectedVersion: (): SimVersion | undefined => {
    const tabId = getSelectedTabId(state);
    if (tabId === undefined) return undefined;
    return state.pageData?.get(tabId)?.selectedVersion;
  },
  getAppliedFilters: (groupFilter:FilterGroup = FilterGroup.None): AdvancedFilterModel | undefined => {
    const tabId = getSelectedTabId(state);
    if (tabId === undefined) return undefined;
    return state.pageData?.get(tabId)?.appliedFilters?.get(groupFilter);
  },
  getAppliedTreeFilters: (groupFilter:FilterGroup = FilterGroup.None): AdvancedFilterModel | undefined => {
    const tabId = getSelectedTabId(state);
    if (tabId === undefined) return undefined;
    return state.pageData?.get(tabId)?.appliedTreeFilters?.get(groupFilter);
  },
  getAppliedGraphFilters: (groupFilter:FilterGroup = FilterGroup.None): AdvancedFilterModel | undefined => {
    const tabId = getSelectedTabId(state);
    if (tabId === undefined) return undefined;
    return state.pageData?.get(tabId)?.appliedGraphFilters?.get(groupFilter);
  },
  getAllFilters: (filterGroup:FilterGroup = FilterGroup.None): AdvancedFilterModel[] | undefined => {
    const tabId = getSelectedTabId(state);
    if (tabId === undefined) return undefined;

    const appliedFilters = state.pageData?.get(tabId)?.appliedFilters?.get(filterGroup);
    const appliedTreeFilters = state.pageData?.get(tabId)?.appliedTreeFilters?.get(filterGroup);
    const appliedGraphFilters = state.pageData?.get(tabId)?.appliedGraphFilters?.get(filterGroup);

    const filters = [appliedFilters, appliedTreeFilters, appliedGraphFilters].filter(
      (x) => x !== undefined
    ) as AdvancedFilterModel[];

    return filters.length ? filters : undefined;
  },
  // only return filter models that are for the given datasource
  getAllFilterModelsForDataSource: (src: string, filterGroup:FilterGroup = FilterGroup.None): Map<iTechDataWebFilterEnum, AdvancedFilterModel> | undefined => {
    const tabId = getSelectedTabId(state);
    if (tabId === undefined) return undefined;

    const id = TableEnum[src as keyof typeof TableEnum];
    const appliedFilters = state.pageData?.get(tabId)?.appliedFilters?.get(filterGroup);
    const appliedTreeFilters = state.pageData?.get(tabId)?.appliedTreeFilters?.get(filterGroup);
    const appliedGraphFilters = state.pageData?.get(tabId)?.appliedGraphFilters?.get(filterGroup);

    const map = new  Map<iTechDataWebFilterEnum, AdvancedFilterModel>();

    // this filter type is ignored for breadcrumbs..
    if(appliedFilters && appliedFilters.id !== 'reviewPageFixedFilter'){
      const ds = appliedFilters.dataSources.filter((x) => _canApplyFilter(src, id, x));
      if(ds.length){
        map.set(iTechDataWebFilterEnum.advanced, {...appliedFilters, dataSources:ds});
      }
    }

    if(appliedTreeFilters){
      const ds = appliedTreeFilters.dataSources.filter((x) => _canApplyFilter(src, id, x));
      if(ds.length){
        map.set(iTechDataWebFilterEnum.tree, {...appliedTreeFilters, dataSources:ds});
      }
    }

    if(appliedGraphFilters){
      const ds = appliedGraphFilters.dataSources.filter((x) => _canApplyFilter(src, id, x));
      if(ds.length){
        map.set(iTechDataWebFilterEnum.graph, {...appliedGraphFilters, dataSources:ds});
      }
    }

    return map.size ? map : undefined;
  },
  // src is dataSource
  getAllAppliedFiltersForDataSource: (src: string, id: number, filterGroup:FilterGroup = FilterGroup.None): Map<iTechDataWebFilterEnum, DataSource[]> | undefined => {
    const tabId = getSelectedTabId(state);
    if (tabId === undefined) return undefined;

    const appliedFilters = state.pageData?.get(tabId)?.appliedFilters?.get(filterGroup);
    const appliedTreeFilters = state.pageData?.get(tabId)?.appliedTreeFilters?.get(filterGroup);
    const appliedGraphFilters = state.pageData?.get(tabId)?.appliedGraphFilters?.get(filterGroup);

    const map = new Map<iTechDataWebFilterEnum, DataSource[]>();

    // this filter type is ignored for breadcrumbs..
    if(appliedFilters && appliedFilters.id !== 'reviewPageFixedFilter'){
      const ds = appliedFilters.dataSources.filter((x) => _canApplyFilter(src, id, x));
      map.set(iTechDataWebFilterEnum.advanced, ds);
    }
    if(appliedTreeFilters){
      const ds:DataSource[] = [];

    // TODO - tidy up structure of treefilters...
    // currently seems to be an advancedfiltermodel with datasource but each of the filters is a datasource too
    appliedTreeFilters?.dataSources
      .filter((x) => _canApplyFilter(src, id, x))
      .forEach((v) => {
        v.filters.forEach((filter: any) => {
          ds?.push({
            filters: filter.filters,
            rule: filter.rule,
            name: src,
            rowId: 0,
            id: 0,
          });
        });
      });

      map.set(iTechDataWebFilterEnum.tree, ds);
    }
    
    if(appliedGraphFilters){
      const ds = appliedGraphFilters.dataSources.filter((x) => _canApplyFilter(src, id, x));
      map.set(iTechDataWebFilterEnum.graph, ds);
    }

    return map.size ? map : undefined; // a map of arrays - one per filter type
  },
  getAllFiltersForDataSource: (src: string, id: number, filterGroup:FilterGroup = FilterGroup.None): DataSource[] | undefined => {
    const tabId = getSelectedTabId(state);
    if (tabId === undefined) return undefined;

    const appliedFilters = state.pageData?.get(tabId)?.appliedFilters?.get(filterGroup);
    const appliedTreeFilters = state.pageData?.get(tabId)?.appliedTreeFilters?.get(filterGroup);
    const appliedGraphFilters = state.pageData?.get(tabId)?.appliedGraphFilters?.get(filterGroup);

    const filterModels = [appliedFilters, appliedGraphFilters].filter(
      (x) => x !== undefined
    ) as AdvancedFilterModel[];

    let ds = AppliedDataSources.get(src);
    if (!ds) {
      ds = [];
      AppliedDataSources.set(src, ds);
    }
    ds.length = 0;

    filterModels.forEach((m) =>
      m.dataSources.filter((x) => _canApplyFilter(src, id, x)).forEach((d) => ds?.push(d))
    );

    // TODO - tidy up structure of treefilters...
    // currently seems to be an advancedfiltermodel with datasource but each of the filters is a datasource too
    appliedTreeFilters?.dataSources
      .filter((x) => _canApplyFilter(src, id, x))
      .forEach((v) => {
        v.filters.forEach((filter: any) => {
          ds?.push({
            filters: filter.filters,
            rule: filter.rule,
            name: src,
            rowId: 0,
            id: 0,
          });
        });
      });

    return ds.length ? ds : undefined; // TODO - want a map of these arrays - one per datasource
  },
  getShowError: (): boolean => {
    return state.errorData.showDialog;
  },
  getTemplates: (): ITechDataWebTemplate[] | undefined => {
    return state.templates?.filter(
      (template) => template.iTechDataWebTemplateTypeRowId === iTechDataWebTemplateEnum.template
    );
  },
  getViews: (): ITechDataWebTemplate[] | undefined => {
    return state.templates?.filter(
      (template) => template.iTechDataWebTemplateTypeRowId === iTechDataWebTemplateEnum.view
    );
  },
  getSelectedCaseId: (): number | undefined => {
    const { menuList } = state;
    const page = menuList.find((x) => x.selected);
    const caseId = page?.iTechDataWebTabs.find(() => true)?.iTechDataCaseRowId;

    return caseId || undefined;
  },
  getSelectedMenuAndTab: (): { menuId?: number; tabId?: number } => {
    return getSelectedMenuIdAndTabId(state);
  },
  getShowHidden: (): boolean => {
    return state.showHidden;
  },
  getSelectedCase: (): CaseModel | undefined => {
    const { selectedCase } = state;
    return selectedCase;
  },
  getSelectedTabId: (): number | undefined => {
    return getSelectedTabId(state);
  },
  getSelectedTab: (): Immutable<ITechDataWebTabExtended> | undefined => {
    return getSelectedTab(state);
  },
  getMenus: (): Array<ITechDataWebMenuExtended> => {
    const { menuList } = state;
    return menuList;
  },
  getDataSources: (): ReadonlyArray<Immutable<ITechControlTable>> => {
    const { dataSources } = state;
    return dataSources;
  },
  getCaseClosed: (): boolean | undefined => {
    const { selectedCase } = state;
    if (selectedCase)
      return selectedCase.iTechDataCaseStatusTypeRowId === iTechDataCaseStatusEnum.closed;
    return undefined;
  },
  getFolders: (): Array<ITechDataWebFolderExtended> => {
    const { folderList } = state;
    return folderList;
  },
});

function _canApplyFilter(datasourceName: string, id: number, datasource: DataSource) {
  if (datasource.name === datasourceName) {
    return true;
  }
  if (datasourceName === "ITechWebSavedResults") {
    // check if iTechControlTable RowId of this datasource matches datasource.rowId
    return datasource.rowId === id;
  }
  return false;
}

export function getSelectedTabId(state: StoreContextState): number | undefined {
  const { menuList } = state;

  const page = menuList.find((x) => x.selected);

  return page?.iTechDataWebTabs?.find((x) => x.selected)?.rowId;
}

export function getSelectedTab(state: StoreContextState): ITechDataWebTabExtended | undefined {
  const { menuList } = state;

  const page = menuList.find((x) => x.selected);

  return page?.iTechDataWebTabs?.find((x) => x.selected);
}

export function getSelectedMenuIdAndTabId(state: StoreContextState): {
  menuId: number | undefined;
  tabId: number | undefined;
} {
  const { menuList } = state;

  const page = menuList.find((x) => x.selected);

  return { menuId: page?.rowId, tabId: page?.iTechDataWebTabs?.find((x) => x.selected)?.rowId };
}
