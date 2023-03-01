import { AdvancedFilterModel } from "../Model/iTechRestApi/AdvancedFilterModel";
import { ITechDataWebFilter } from "../Model/iTechRestApi/ITechDataWebFilter";

export const getAdvancedFilter = (filter: ITechDataWebFilter): AdvancedFilterModel => {
    return JSON.parse(filter.json) as AdvancedFilterModel;
}

export const getAdvancedFilterDataSource = (filter: ITechDataWebFilter): string | undefined => {
    const filterModel = JSON.parse(filter.json) as AdvancedFilterModel;
    if (filterModel.dataSources?.length) {
        return filterModel.dataSources[0].name;
    }
    return undefined;
}