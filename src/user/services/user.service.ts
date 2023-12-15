import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../repositories/repositories/user.repository';
import {
  IDatabaseCreateOptions,
  IDatabaseFindOneOptions,
} from 'src/common/database/interfaces/database.interface';
import { UserDoc, UserEntity } from '../repositories/entities/user.entity';
import { UserRegisterDto } from '../dtos/user.register.dto';
import { IAuthPassword } from 'src/common/auth/interfaces/auth.interface';
import { HelperDateService } from 'src/common/helper/services/helper.date.service';
import { plainToInstance } from 'class-transformer';
import { UserPayloadSerialization } from '../serializations/user.payload.serialization';
import { UserCreateDto } from '../dtos/user.create.dto';
import {
  ICreateUserLogicOptions,
  IUpdateUserLogicOptions,
} from '../interfaces/user.interface';
import { UserUpdateDto } from '../dtos/user.update.dto';
import { USER_DELETE_TYPES } from '../constants/user.enum.constants';
import { UserDeleteDto } from '../dtos/user.delete.dto';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly helperDateService: HelperDateService,
  ) {}

  async findOneByEmail<T>(
    email: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<T> {
    const user = this.userRepository.findOne<T>({ email }, options);

    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'user.error.notFound',
      });
    }

    return user;
  }

  async findOneById<T>(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<T> {
    const user = await this.userRepository.findOneById<T>(_id, options);

    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'user.error.notFound',
      });
    }

    return user;
  }

  async create(
    {
      username,
      email,
      firstName,
      lastName,
      mobileNumber,
      gender,
    }: UserRegisterDto | UserCreateDto,
    { passwordHash, salt }: IAuthPassword,
    options?: IDatabaseCreateOptions,
    logicOptions: ICreateUserLogicOptions = {},
  ): Promise<UserDoc> {
    const usernameExists: boolean = await this.userRepository.exists({
      username,
    });

    if (usernameExists) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'user.error.usernameExists',
      });
    }

    const emailExist: boolean = await this.userRepository.exists({ email });
    if (emailExist) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'user.error.emailExist',
      });
    }

    if (mobileNumber) {
      const mobileNumberExist: boolean = await this.userRepository.exists({
        mobileNumber,
      });

      if (mobileNumberExist) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'user.error.mobileNumberExist',
        });
      }
    }

    const create: UserEntity = new UserEntity();
    create.username = username;
    create.email = email;
    create.firstName = firstName;
    create.lastName = lastName;
    create.password = passwordHash;
    create.salt = salt;

    if (!logicOptions.createdByAdmin) {
      create.signUpDate = this.helperDateService.create();
    }

    if (logicOptions.createdBy) {
      create.createdBy = logicOptions.createdBy;
    }

    create.mobileNumber = mobileNumber ?? undefined;
    create.gender = gender;

    const user: UserDoc = await this.userRepository.create<UserEntity>(
      create,
      options,
    );

    return user;
  }

  async payloadSerialization(data: UserDoc): Promise<UserPayloadSerialization> {
    return plainToInstance(UserPayloadSerialization, data.toObject());
  }

  async update(
    user: string,
    {
      username,
      email,
      firstName,
      lastName,
      mobileNumber,
      gender,
    }: UserUpdateDto,
    passwordHashWithSalt?: IAuthPassword,
    options?: IDatabaseCreateOptions,
    logicOptions: IUpdateUserLogicOptions = {},
  ): Promise<UserDoc> {
    const updatedUser: UserDoc = await this.userRepository.findOneById(user);

    if (!updatedUser) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'user.error.notFound',
      });
    }

    if (updatedUser.username !== username) {
      const usernameExists: boolean = await this.userRepository.exists({
        username,
      });

      if (usernameExists) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'user.error.usernameExists',
        });
      }
    }

    if (updatedUser.email !== email) {
      const emailExist: boolean = await this.userRepository.exists({ email });
      if (emailExist) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'user.error.emailExist',
        });
      }
    }

    if (updatedUser.mobileNumber !== mobileNumber) {
      if (mobileNumber) {
        const mobileNumberExist: boolean = await this.userRepository.exists({
          mobileNumber,
        });

        if (mobileNumberExist) {
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'user.error.mobileNumberExist',
          });
        }
      }
    }

    updatedUser.username = username;
    updatedUser.email = email;
    updatedUser.firstName = firstName;
    updatedUser.lastName = lastName;
    if (passwordHashWithSalt) {
      updatedUser.password = passwordHashWithSalt.passwordHash;
      updatedUser.salt = passwordHashWithSalt.salt;
    }

    if (logicOptions.updatedBy) {
      updatedUser.updatedBy = logicOptions.updatedBy;
    }

    updatedUser.mobileNumber = mobileNumber ?? undefined;
    updatedUser.gender = gender;

    const userUpdated: UserDoc = await this.userRepository.save(
      updatedUser,
      options,
    );

    return userUpdated;
  }

  async deleteById(user: string, bodyParams: UserDeleteDto): Promise<void> {
    const withDeleted: boolean = bodyParams.type === USER_DELETE_TYPES.HARD;
    const userToDelete: UserDoc = await this.userRepository.findOneById(user, {
      withDeleted,
    });

    if (!userToDelete) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'user.error.notFound',
      });
    }

    if (bodyParams.type === USER_DELETE_TYPES.SOFT) {
      userToDelete.deleteReason = bodyParams.reason;
      await this.userRepository.softDelete(userToDelete);
    } else if (bodyParams.type === USER_DELETE_TYPES.HARD) {
      await this.userRepository.delete(userToDelete);
    }
  }

  async getList(
    { _limit, _offset, _order }: PaginationListDto,
    find: Record<string, any> = {},
  ) {
    
    const users: UserEntity[] = await this.userRepository.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
      withDeleted: true,
    });

    const total: number = await this.userRepository.getTotal(find, {
      withDeleted: true,
    });

    return {
      list: users,
      total,
    };
  }
}
