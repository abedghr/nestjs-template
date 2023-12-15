import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/common/auth/services/auth.service';
import { UserService } from 'src/user/services/user.service';
import { USER_GENDER } from 'src/user/constants/user.enum.constants';

@Injectable()
export class MigrationUserSeed {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Command({
    command: 'seed:user',
    describe: 'seed users',
  })
  async seeds(): Promise<void> {
    const password = 'admin1234!';
    try {
      const passwordHash = await this.authService.createPassword(password);
      await this.userService.create(
        {
          username: 'super-admin',
          email: 'admin@gmail.com',
          firstName: 'Super',
          lastName: 'Admin',
          password,
          mobileNumber: '0000000000',
          gender: USER_GENDER.MALE,
        },
        passwordHash,
      );
    } catch (err: any) {
      throw new Error(err.message);
    }

    return;
  }
}
