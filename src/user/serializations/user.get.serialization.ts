import { fa, faker } from '@faker-js/faker';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Exclude, Transform, Type } from 'class-transformer';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';

export class UserGetSerialization extends ResponseIdSerialization {

    @ApiProperty({
        example: faker.internet.userName(),
    })
    readonly username: string;

    @ApiProperty({
        example: faker.internet.email(),
    })
    readonly email: string;

    @ApiProperty({
        example: faker.phone.number(),
    })
    readonly mobileNumber?: string;

    @ApiProperty({
        example: true,
    })
    readonly isActive: boolean;

    @ApiProperty({
        example: faker.person.firstName(),
    })
    readonly firstName: string;

    @ApiProperty({
        example: faker.person.lastName(),
    })
    readonly lastName: string;

    @ApiProperty({
        allOf: [{ $ref: getSchemaPath(AwsS3Serialization) }],
    })
    readonly photo?: AwsS3Serialization;

    @Exclude()
    readonly password: string;

    @ApiProperty({
        example: faker.date.recent(),
    })
    readonly signUpDate: Date;

    @Exclude()
    readonly salt: string;

    @ApiProperty({
        example: false,
    })
    readonly isDeleted: Boolean;

    @ApiProperty({
        description: 'Date created at',
        example: faker.date.recent(),
        required: true,
    })
    readonly createdAt: Date;

    @ApiProperty({
        description: 'Date updated at',
        example: faker.date.recent(),
        required: false,
    })
    readonly updatedAt: Date;

    @Exclude()
    readonly deletedAt?: Date;
}
