export interface FrontendFilter {
    key: string;
    value: Value[];
}

export interface Value {
    rule: string;
    filters: Filter[];
}

export interface Filter {
    id: number;
    rowId: number;
    name: string;
    iTechControlColumnTypeRowId: number;
    columnName: string;
    operation: string;
    value: string;
    operationName: string;
    valueName: string;
}