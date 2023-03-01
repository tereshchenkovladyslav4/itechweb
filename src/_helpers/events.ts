import { AdvancedFilterModel } from "../Model/iTechRestApi/AdvancedFilterModel";
import { Direction } from "../Model/Types/Direction";

export const AddTabWithGridEvent = "tab:addWithNewGrid";

export const AddSearchTextEvent = "table:addSearchText";
export const ApplySavedResultSetEvent = "table:applySavedResultSet";

export const MoveSelectedItemEvent = "table:moveSelectedItem";
export const RefreshTableEvent = "table:RefreshTable";
export const RefreshPreviewEvent = "preview:RefreshPreview";
export const AddSavedResultEvent = "savedResult:add";
export const UpdateMenusEvent = "menu:update";
export const CaseChangedEvent = "case:update";

export type ResultSetEvent = {
  rowId: number;
  dataSource: string;
  iTechControlTableRowId: number;
  resultSetName?:string;
};

export type MoveSelectedEvent = {
  direction: Direction;
};

// optional - to selectively refresh a table only when showing the given datasource
export type RefreshTableEventType = {
  dataSource: string;
};

export type RefreshPreviewEventType = {
  dataSource: string;
};

export type TabWithGridEventType = {
    grid: any;
    graphFilters?: AdvancedFilterModel;
}

export type SearchTextEventType = {
  searchText: string;
  dataSource: string;
}

export type CaseChangedEventType = {
  rowId:number;
}

export const on = (eventType: string, listener: (e: any) => void): void =>
  document.addEventListener(eventType, listener);

export const off = (eventType: string, listener: (e: any) => void): void =>
  document.removeEventListener(eventType, listener);

export const once = (eventType: string, listener: (e: any) => void): void => {
  on(eventType, handleEventOnce);

  function handleEventOnce(event: Event) {
    listener(event);
    off(eventType, handleEventOnce);
  }
};

export const trigger = (
  eventType: string,
  data?: ResultSetEvent | MoveSelectedEvent | RefreshTableEventType | RefreshPreviewEventType | TabWithGridEventType | SearchTextEventType
): void => {
  const event = new CustomEvent(eventType, { detail: data });
  document.dispatchEvent(event);
};
