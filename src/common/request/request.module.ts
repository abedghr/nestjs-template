import {
    HttpStatus,
    Module,
    UnprocessableEntityException,
    ValidationError,
    ValidationPipe,
} from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { RequestMiddlewareModule } from 'src/common/request/middleware/request.middleware.module';
import { ENUM_REQUEST_STATUS_CODE_ERROR } from './constants/request.status-code.constant';
import { RequestTimeoutInterceptor } from './interceptors/request.timeout.interceptor';

@Module({
    controllers: [],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: RequestTimeoutInterceptor,
        },
        {
            provide: APP_PIPE,
            useFactory: () =>
                new ValidationPipe({
                    transform: true,
                    skipNullProperties: false,
                    skipUndefinedProperties: false,
                    skipMissingProperties: false,
                    forbidUnknownValues: false,
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                    exceptionFactory: async (errors: ValidationError[]) =>
                        new UnprocessableEntityException({
                            statusCode:
                                ENUM_REQUEST_STATUS_CODE_ERROR.REQUEST_VALIDATION_ERROR,
                            message: 'request.validation',
                            errors,
                        }),
                }),
        }
    ],
    imports: [RequestMiddlewareModule],
})
export class RequestModule {}
