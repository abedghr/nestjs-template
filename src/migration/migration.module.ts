import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { AuthModule } from 'src/common/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { MigrationUserSeed } from './seeds/migration.user.seed';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [
        CommonModule,
        CommandModule,
        AuthModule,
        UserModule
    ],
    providers: [
        MigrationUserSeed,
    ],
    exports: [],
})
export class MigrationModule {}
