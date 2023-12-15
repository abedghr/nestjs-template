import { HttpStatus, applyDecorators } from '@nestjs/common';
import { Doc, DocPaging } from 'src/common/doc/decorators/doc.decorator';
import { UserGetSerialization } from '../serializations/user.get.serialization';

export function UserCreateDoc(): MethodDecorator {
    return applyDecorators(
        Doc('user.create', {
            auth: {
                jwtAccessToken: true,
            },
            response: {
                httpStatus: HttpStatus.CREATED,
                serialization: UserGetSerialization
            },
        })
    );
}

export function UserUpdateDoc(): MethodDecorator {
    return applyDecorators(
        Doc('user.update', {
            auth: {
                jwtAccessToken: true,
            },
            response: {
                httpStatus: HttpStatus.OK,
                serialization: UserGetSerialization
            },
        })
    );
}

export function UserDeleteDoc(): MethodDecorator {
    return applyDecorators(
        Doc('user.delete', {
            auth: {
                jwtAccessToken: true,
            },
            response: {
                httpStatus: HttpStatus.NO_CONTENT
            },
        })
    );
}

export function UserGetDoc(): MethodDecorator {
    return applyDecorators(
        Doc('user.get', {
            auth: {
                jwtAccessToken: true,
            },
            response: {
                httpStatus: HttpStatus.OK,
                serialization: UserGetSerialization
            },
        })
    );
}

export function UserListDoc(): MethodDecorator {
    return applyDecorators(
        DocPaging<UserGetSerialization>('user.list', {
            auth: {
                jwtAccessToken: true,
            },
            response: {
                statusCode: HttpStatus.OK,
                serialization: UserGetSerialization
            },
        })
    );
}