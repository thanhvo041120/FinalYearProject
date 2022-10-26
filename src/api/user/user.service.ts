import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto, CreateUserResponseDto } from 'src/api/user/dtos/addUserDtos';
import {
  UpdateUserDto,
  UpdateUserResponseDto,
} from 'src/api/user/dtos/updateUserDtos';
import { Repository } from 'typeorm';
import { IUser } from './interfaces';
import { User } from './entities';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  public async createUser(dto: CreateUserDto): Promise<CreateUserResponseDto> {
    const response = await this.userRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(dto)
      .execute();

    return {
      message: "Success",
      affectedRow: response.identifiers[0].id,
    };
  }

  public async findUserByPhoneNumber(phonenumber: string): Promise<IUser> {
    const response: IUser = await this.userRepository
      .createQueryBuilder('user')
      .where('user.phonenumber = :phonenumber', { phonenumber: phonenumber })
      .getOne();
    return response;
  }

  public async findUsers(): Promise<IUser[]> {
    const response: IUser[] = await this.userRepository
      .createQueryBuilder('user')
      .getMany();
    return response;
  }

  public async findUsersByOption(option: Object): Promise<IUser[]> {
    const response: IUser[] = await this.userRepository.findBy(option);
    return response;
  }

  public async updateUser(
    dto: UpdateUserDto,
    userId: number,
  ): Promise<UpdateUserResponseDto> {
    const response = await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set(dto)
      .where('id = :userId', { userId: userId })
      .execute();
    return { affectedRow: response.affected };
  }

  public async deleteUser(userId: number): Promise<number> {
    const response = await this.userRepository
      .createQueryBuilder()
      .delete()
      .from(User)
      .where('id = :userId', { userId: userId })
      .execute();
    return response.affected;
  }
}
