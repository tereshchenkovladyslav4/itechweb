import { iTechControlColumnEnum } from "../Model/iTechRestApi/iTechControlColumnEnum";
import { ITechControlTable } from "../Model/iTechRestApi/ITechControlTable";
import { iTechControlTableReferenceEnum } from "../Model/iTechRestApi/iTechControlTableReferenceEnum";
import { ITechDataSecurityObject } from "../Model/iTechRestApi/ITechDataSecurityObject";
import { authenticationService } from "../_services/authenticationService";
import { Immutable } from "../_context/selectors/useSelectors";
import { toSentence } from "./utilities";
import { TableEnum } from "../Model/iTechRestApi/TableEnum";

// https://www.typescriptlang.org/docs/handbook/advanced-types.html#index-types
export function getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
  return o[propertyName]; // o[propertyName] is of type T[K]
}
export function validateEmail(email: string): boolean {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function getEnumKeyByEnumValue(myEnum: any, enumValue: number | string): string {
  const keys = Object.keys(myEnum).filter((x) => myEnum[x] == enumValue);
  return keys.length > 0 ? keys[0] : "";
}

// lookup for string enums from string to enum.XX
// export const enumFromValue = <T extends Record<string, string>>(val: string, _enum: T) => {
//   const enumName = (Object.keys(_enum) as Array<keyof T>).find(k => _enum[k] === val)
//   if (!enumName) throw Error() // here fail fast as an example
//   return _enum[enumName]
// }

// const stringToEnumByValue = <T>(enumObj: Object, value: string): T | undefined =>   Object.values(enumObj).find((v) => v === value); 
// const stringToEnumByKey = <T>(enumObj: Object, value: string): T | undefined =>   Object.values(enumObj)[Object.keys(enumObj).indexOf(value)];

// export const stringToEnumValue = <T extends Record<string, unknown>, K extends keyof T>(enumObj: T, value: string): T[keyof T] | undefined =>
//   enumObj[Object.keys(enumObj).filter((k) => enumObj[k as K].toString() === value)[0] as keyof typeof enumObj]; 

// get name, value pairs array for enum
export function getEnumKeyValues<T extends Record<string, unknown>>(
  enumeration: T,
  filter?: (s: [string, any]) => boolean // optional filter
): { name: string; value: number }[] {
  const items = Object.entries(enumeration)
    .filter((x) => isNaN(Number(x[0])))
    .filter((x) => filter === undefined || filter(x))
    .map((x) => ({ name: toSentence(x[0]), value: Number(x[1]) }));

  return items;
}

export function getInvestigationId(): { rowId: number | undefined; datasource: string; } | undefined {
  const url = window.location.pathname;
  const parts = url.split("/");
  if(parts?.length >= 4 && parts[1] === 'investigation'){
    const datasource = parts && parts.length >= 3 ? parts[2] : '';
    const rowId = parts && parts.length >= 4 ? Number(parts[3]) : undefined;
      // or use:  const investigationId = sessionStorage.getItem("investigationId");
  
    return {rowId, datasource};
  }
}

export function loggedInSecurityObject(): ITechDataSecurityObject | undefined {
  if (!authenticationService || !authenticationService.currentUserValue) return;

  const user = authenticationService.currentUserValue.authenticatedUser;
  const currentSecurityObject = new ITechDataSecurityObject();
  currentSecurityObject.rowId = user.rowId;
  currentSecurityObject.forename = user.forename;
  currentSecurityObject.surname = user.surname;
  currentSecurityObject.username = user.username;
  currentSecurityObject.dateArchived = null;
  return currentSecurityObject;
}

export const tableReferenceURL = (type: iTechControlTableReferenceEnum): string => {
  switch (type) {
    case iTechControlTableReferenceEnum.iTechSimSalesForce:
      return "iTechWebSimSalesForce";
    case iTechControlTableReferenceEnum.iTechSimAccident:
      return "iTechWebSimAccident";
    case iTechControlTableReferenceEnum.iTechSim:
      return "iTechWebSim";
    case iTechControlTableReferenceEnum.iTechDataSecurityObject:
      return "iTechWebSecurityObject";
    case iTechControlTableReferenceEnum.iTechDataResultSet:
      return "iTechDataWebResults";
    case iTechControlTableReferenceEnum.iTechAudit:
      return "iTechWebAudit";
    case iTechControlTableReferenceEnum.iTechStockHeader:
      return "iTechStockHeader";
    case iTechControlTableReferenceEnum.iTechStockAimAudt:
      return "iTechStockAimAudt";
    case iTechControlTableReferenceEnum.iTechStockOrderManagement:
      return "iTechStockOrderManagement";
  }
  return "iTechWebSim";
};

// similar to above but index maps from iTechControlTableRowId
export const savedResultsDataSourceMap = [
  "ITechWebSim",
  "ITechWebAudit",
  "ITechWebSecurityObject",
  "ITechWebUser",
  "ITechWebSimCaseFile",
  "ITechWebSimCaseFileUser",
  "ITechWebCaseManagement",
  "ITechWebTask",
  "ITechWebTaskOwner",
  "ITechWebSimAccident",
  "ITechWebSimSalesForce",
];

// helper for virtual table dynamic date filter ( time period ) to associate to column
export function getDynamicDateDatasourceColumn(
  source: string,
  tables: ReadonlyArray<Immutable<ITechControlTable>>
): string | undefined {
  const ds = tables.find((x) => x.name === source);
  if (ds) {
    const dynamicDateCol = ds.iTechControlColumns.find(
      (c) => c.iTechControlColumnTypeRowId === iTechControlColumnEnum.dateTime && c.isDynamicDate
    );
    if (dynamicDateCol) return dynamicDateCol.name;

    // fallback if not configured yet for this DB
    // TODO - this has columns marked as datetime but they are actual date types in sql not ticks.
    if (source === TableEnum[TableEnum.iTechStockAimAudt]) return undefined;
    
    const firstDateCol = ds.iTechControlColumns.find(
      (c) => c.iTechControlColumnTypeRowId === iTechControlColumnEnum.dateTime
    );
    if (firstDateCol) return firstDateCol.name;
  }
  return undefined;
}
