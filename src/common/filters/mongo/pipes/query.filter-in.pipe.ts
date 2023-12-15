import { Inject, Injectable, mixin, Type } from '@nestjs/common';
import {
    ArgumentMetadata,
    PipeTransform,
    Scope,
} from '@nestjs/common/interfaces';
import { REQUEST } from '@nestjs/core';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { QueryFilterService } from '../services/query.service';

export function QueryFilterInPipe<T>(
    defaultValue: T,
    defaultEnum: Record<string, any>
): Type<PipeTransform> {
    @Injectable({ scope: Scope.REQUEST })
    class MixinQueryFilterInPipe implements PipeTransform {
        constructor(
            @Inject(REQUEST) protected readonly request: IRequestApp,
            private readonly queryFilterService: QueryFilterService
        ) {}

        async transform(
            value: string,
            { data: field }: ArgumentMetadata
        ): Promise<Record<string, { $in: T[] }>> {
            let finalValue: T[] = defaultValue as T[];

            if (!value) {
                return {};
            }

            finalValue = value
                .split(',')
                .map((val: string) => defaultEnum[val])
                .filter((val: string) => val) as T[];

            this.request.__filters = {
                ...this.request.__filters,
                [field]: finalValue as string[],
            };

            return this.queryFilterService.filterIn<T>(field, finalValue);
        }
    }

    return mixin(MixinQueryFilterInPipe);
}
