import { Query } from '@nestjs/common';
import { QueryFilterEqualPipe } from './pipes/query.filter-equal.pipe';
import { QueryFilterInPipe } from './pipes/query.filter-in.pipe';
import { QueryFilterRangePipe } from './pipes/query.filter-range.pipe';
import { ENUM_FILTER_OPERATIONS } from './constants/pagination.enum.constant';

export function QueryFilterEqual(field: string): ParameterDecorator {
    return Query(field, QueryFilterEqualPipe());
}

export function QueryFilterIn<T>(
    field: string,
    defaultValue: T,
    defaultEnum: Record<string, any>
): ParameterDecorator {
    return Query(field, QueryFilterInPipe<T>(defaultValue, defaultEnum));
}

export function QueryFilterRange(
    field: string,
    operation: ENUM_FILTER_OPERATIONS
): ParameterDecorator {
    return Query(field, QueryFilterRangePipe(operation));
}
