import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { UserModule } from 'src/user/user.module';

@Module({
    controllers: [],
    providers: [],
    imports: [
        CommonModule,
        UserModule,
    ],
})
export class AppModule {}
