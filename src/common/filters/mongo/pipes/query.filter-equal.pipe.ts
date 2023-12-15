import { Inject, Injectable, mixin, Type } from '@nestjs/common';
import {
    ArgumentMetadata,
    PipeTransform,
    Scope,
} from '@nestjs/common/interfaces';
import { REQUEST } from '@nestjs/core';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { QueryFilterService } from '../services/query.service';

export function QueryFilterEqualPipe(): Type<PipeTransform> {
    @Injectable({ scope: Scope.REQUEST })
    class MixinQueryFilterEqualPipe implements PipeTransform {
        constructor(
            @Inject(REQUEST) protected readonly request: IRequestApp,
            private readonly queryFilterService: QueryFilterService
        ) {}

        async transform(
            value: string,
            { data: field }: ArgumentMetadata
        ): Promise<Record<string, string | number>> {
            if (!value) {
                return {};
            }

            const finalValue: string | number = value;

            this.request.__filters = {
                ...this.request.__filters,
                [field]: finalValue,
            };

            return this.queryFilterService.filterEqual<string | number>(
                field,
                finalValue
            );
        }
    }

    return mixin(MixinQueryFilterEqualPipe);
}
