export interface IQueryFilterService {
    filterEqual<T = string>(field: string, filterValue: T): Record<string, T>;
    filterIn<T = string>(
        field: string,
        filterValue: T[]
    ): Record<string, { $in: T[] }>;
}
