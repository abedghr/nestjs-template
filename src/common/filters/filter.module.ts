import { Global, Module } from '@nestjs/common';
import { QueryFilterService } from './mongo/services/query.service';

@Global()
@Module({
    providers: [QueryFilterService],
    exports: [QueryFilterService],
    imports: [],
})
export class FilterModule {}
