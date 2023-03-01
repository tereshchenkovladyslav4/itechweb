

export interface Filter {
    rowId: number;
    name: string;
    operation: string;
    value: string;
    iTechControlColumnTypeRowId ?  : any;
    iTechControlColumnType ?  : any;
}

export interface Expression {
    rule: string;
    filters: Filter[];
}

export interface ChildNode {
    guid: string;
    type: string;
    name: string;
    iTechControlTableRowId: number;
    expressions: Expression[];
    childNodes: any[];
    keyTypeIndex: number;
    end: boolean;
}

export interface Filter2 {
    rowId: number;
    name: string;
    operation: string;
    value: string;
    iTechControlColumnTypeRowId ?  : any;
    iTechControlColumnType ?  : any;
}

export interface Expression2 {
    rule: string;
    filters: Filter2[];
}

export default interface Tree {
    guid: string;
    iTechControlTableRowId: number;
    name: string;
    keyTypeIndex ?  : number;
    childNodes: ChildNode[];
    expressions: Expression2[];
    type: string;
    end ?  : boolean;
}