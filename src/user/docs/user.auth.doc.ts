import { HttpStatus, applyDecorators } from '@nestjs/common';
import { Doc } from 'src/common/doc/decorators/doc.decorator';
import { UserLoginSerialization } from '../serializations/user.login.serialization';
import { UserGetSerialization } from '../serializations/user.get.serialization';
import { UserProfileSerialization } from '../serializations/user.profile.serialization';

export function UserAuthTokenDoc(): MethodDecorator {
    return applyDecorators(
        Doc<UserLoginSerialization>('user.login', {
            response: {
                httpStatus: HttpStatus.OK,
                serialization: UserLoginSerialization,
            },
        })
    );
}

export function UserAuthRefreshTokenDoc(): MethodDecorator {
    return applyDecorators(
        Doc<UserLoginSerialization>('user.refresh', {
            auth: {
                jwtRefreshToken: true,
            },
            response: {
                httpStatus: HttpStatus.OK,
                serialization: UserLoginSerialization,
            },
        })
    );
}

export function UserAuthRegisterDoc(): MethodDecorator {
    return applyDecorators(
        Doc('user.register', {
            response: {
                httpStatus: HttpStatus.CREATED,
                serialization: UserGetSerialization
            },
        })
    );
}

export function UserAuthProfileDoc(): MethodDecorator {
    return applyDecorators(
        Doc('user.profile', {
            auth: {
                jwtAccessToken: true,
            },
            response: {
                httpStatus: HttpStatus.OK,
                serialization: UserProfileSerialization
            },
        })
    );
}