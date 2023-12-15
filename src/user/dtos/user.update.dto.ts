import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmpty,
    IsNotEmpty,
    IsOptional,
    MaxLength,
    MinLength,
} from 'class-validator';
import { UserCreateDto } from './user.create.dto';

export class UserUpdateDto extends UserCreateDto {

    @ApiProperty({
        description: 'string password',
        example: UserUpdateDto.PASSWORD,
        required: true,
    })
    @IsEmpty()
    @IsOptional()
    @MaxLength(50)
    @MinLength(8)
    readonly password: string;
}
