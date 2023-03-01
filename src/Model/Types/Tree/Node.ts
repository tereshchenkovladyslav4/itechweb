export interface Filter {
    rowId: number;
    name: string;
    operation: string;
    value: number;
    iTechControlColumnTypeRowId?: any;
    iTechControlColumnType?: any;
}

export interface Expression {
    rule: string;
    filters: Filter[];
}

export default interface Node {
    guid: string;
    type: string;
    name: string;
    iTechControlTableRowId: number;
    expressions: Expression[];
    childNodes: any[];
}
