import { Injectable } from '@nestjs/common';
import { IQueryFilterService } from '../interfaces/query.service.interface';
import { ENUM_FILTER_OPERATIONS } from '../constants/pagination.enum.constant';

@Injectable()
export class QueryFilterService implements IQueryFilterService {
    filterEqual<T = string>(field: string, filterValue: T): Record<string, T> {
        return { [field]: filterValue };
    }

    filterIn<T = string>(
        field: string,
        filterValue: T[]
    ): Record<string, { $in: T[] }> {
        return {
            [field]: {
                $in: filterValue,
            },
        };
    }

    filterRange<T = string>(
        field: string,
        filterValue: T,
        operation: ENUM_FILTER_OPERATIONS
    ): Record<string, object> {
        const fieldFilter = {};
        fieldFilter[operation] = filterValue;
        return {
            [field]: fieldFilter
        };
    }
}
