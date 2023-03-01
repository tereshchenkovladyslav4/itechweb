import { iTechControlSearchEnum } from '../iTechRestApi/iTechControlSearchEnum';
import Paging from './Paging';

export interface QuerySet {
    paging: Paging;
    sortBy: string;
    sortDirection: string;
    cols: string[];
    expressions: any;
    searchText: string;
    searchOptions?:iTechControlSearchEnum[]
  }