import {ITechControlTable} from "../../iTechRestApi/ITechControlTable";

export default interface Root {
    $id: string;
    dateArchived?: any;
    dateInserted: number;
    dateModified: number;
    description: string;
    icon: string;
    iTechControlDatabaseSchemaTypeRowId: number;
    name: string;
    rowId: number;
    id: number;
    subItems: SubItem[] | undefined;
    checked: boolean;
    index: number;
    //Added dynamically
    expressions: any[];
    keyTypeIndex: number;
    type: string;
    childNodes: any[];

}

export interface SubItem {
    $id: string;
    advancedFilterSelected?: boolean;
    dateArchived?: any;
    dateInserted?: any;
    dateModified?: any;
    description: string;
    gridIndex?: number;
    gridSelected?: boolean;
    guid?: any;
    helperText: string;
    iTechControlColumnTypeRowId: number;
    iTechControlTableRowId: number;
    minWidth: number;
    name: string;
    notes?: any;
    rowId: number;
    signature?: any;
    status?: any;
    treeIndex: number;
    treeSelected: boolean;
    iTechControlTable: ITechControlTable;
    id: string;
    index: number;
    checked: boolean;
}
