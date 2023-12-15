import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseOptionsService } from 'src/common/database/services/database.options.service';
import { DatabaseOptionsModule } from 'src/common/database/database.options.module';
import { DATABASE_CONNECTION_NAME } from './database/mongo/constants/database.constant';
import configs from './configs';
import { AwsModule } from './aws/aws.module';
import { FilterModule } from './filters/filter.module';
import { HelperModule } from './helper/helper.module';
import { MailModule } from './mail/mail.module';
import { RequestModule } from './request/request.module';
import { MessageModule } from './message/message.module';
import { ResponseModule } from './response/response.module';
import { ErrorModule } from './error/error.module';
import { AuthModule } from './auth/auth.module';
import { DebuggerModule } from './debugger/debugger.module';

@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            load: configs,
            isGlobal: true,
            cache: true,
            envFilePath: ['.env'],
            expandVariables: true,
            validationOptions: {
                allowUnknown: true,
                abortEarly: true,
            },
        }),
        MongooseModule.forRootAsync({
            connectionName: DATABASE_CONNECTION_NAME,
            imports: [DatabaseOptionsModule],
            inject: [DatabaseOptionsService],
            useFactory: (databaseOptionsService: DatabaseOptionsService) =>
                databaseOptionsService.createOptions(),
        }),
        AuthModule,
        AwsModule,
        FilterModule,
        HelperModule,
        MailModule,
        PaginationModule,
        RequestModule,
        ResponseModule,
        MessageModule,
        ErrorModule,
        DebuggerModule.forRoot(),
    ],
})
export class CommonModule {}
