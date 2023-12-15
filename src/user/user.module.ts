import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { AuthenticationController } from './controllers/authentication.controller';
import { AuthenticationService } from './services/authentication-service.service';
import { UserRepositoryModule } from './repositories/user.repository.module';
import { AuthModule } from 'src/common/auth/auth.module';
import { AdminControllerController } from './controllers/admin-controller.controller';

@Module({
  imports: [
    UserRepositoryModule,
    AuthModule
  ],
  controllers: [UserController, AuthenticationController, AdminControllerController],
  providers: [UserService, AuthenticationService],
  exports:[UserService]
})
export class UserModule {}
