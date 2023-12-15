import { Inject, Injectable, mixin, Type } from '@nestjs/common';
import {
    ArgumentMetadata,
    PipeTransform,
    Scope,
} from '@nestjs/common/interfaces';
import { REQUEST } from '@nestjs/core';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { QueryFilterService } from '../services/query.service';
import { ENUM_FILTER_OPERATIONS } from '../constants/pagination.enum.constant';

export function QueryFilterRangePipe(
    operation: ENUM_FILTER_OPERATIONS
): Type<PipeTransform> {
    @Injectable({ scope: Scope.REQUEST })
    class MixinQueryFilterRangePipe implements PipeTransform {
        constructor(
            @Inject(REQUEST) protected readonly request: IRequestApp,
            private readonly queryFilterService: QueryFilterService
        ) {}

        async transform(
            value: string,
            { data: field }: ArgumentMetadata
        ): Promise<Record<string, object>> {
            if (!value) {
                return {};
            }

            const finalValue: string | number = parseFloat(value);

            this.request.__filters = {
                ...this.request.__filters,
                [field]: finalValue,
            };

            return this.queryFilterService.filterRange<string | number>(
                field,
                finalValue,
                operation
            );
        }
    }

    return mixin(MixinQueryFilterRangePipe);
}
