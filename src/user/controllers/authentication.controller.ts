import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserAuthProfileDoc, UserAuthRefreshTokenDoc, UserAuthRegisterDoc, UserAuthTokenDoc } from '../docs/user.auth.doc';
import { Response } from 'src/common/response/decorators/response.decorator';
import { UserLoginSerialization } from '../serializations/user.login.serialization';
import { UserLoginDto } from '../dtos/user.login.dto';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { AuthenticationService } from '../services/authentication-service.service';
import { UserDoc } from '../repositories/entities/user.entity';
import { UserRegisterDto } from '../dtos/user.register.dto';
import { UserGetSerialization } from '../serializations/user.get.serialization';
import { AuthJwtAccessProtected, AuthJwtRefreshProtected, AuthJwtToken } from 'src/common/auth/decorators/auth.jwt.decorator';
import { GetLoggedInUser, UserAuthProtected, UserProtected } from '../decorators/user.decorator';
import { UserPayloadSerialization } from '../serializations/user.payload.serialization';

@ApiTags('Auth')
@Controller({
  version: '1',
  path: '/user',
})
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @UserAuthTokenDoc()
  @Response('user.login', {
    serialization: UserLoginSerialization,
  })
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() body: UserLoginDto): Promise<IResponse> {
    const response: object = await this.authService.login(body);
    return {
      data: response,
    };
  }

  @UserAuthRefreshTokenDoc()
  @Response('user.refresh', { serialization: UserLoginSerialization })
  @UserAuthProtected()
  @UserProtected()
  @AuthJwtRefreshProtected()
  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  async refresh(
      @GetLoggedInUser() viewer: UserDoc
  ): Promise<IResponse> {
      return {
        data: await this.authService.refreshToken(viewer)
      }
      
  }

  @UserAuthRegisterDoc()
  @Response('user.register', {
    serialization: UserGetSerialization,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/register')
  async signUp(@Body() body: UserRegisterDto): Promise<IResponse> {
    const user: UserDoc = await this.authService.register(body);
    return {
      data: user.toObject(),
    };
  }

  @UserAuthProfileDoc()
  @Response('user.profile', {
    serialization: UserGetSerialization,
  })
  @HttpCode(HttpStatus.OK)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/profile')
  async profile(@GetLoggedInUser() viewer: UserDoc): Promise<IResponse> {
    return {
      data: viewer,
    };
  }
}
