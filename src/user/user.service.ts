import { Body, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/utils/dtos/users/addUserDtos';
import { UpdateUserDto } from 'src/utils/dtos/users/updateUserDtos';
import { Repository } from 'typeorm';
import { IUser } from './interfaces/user.interface';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @Inject('USER_REPOSITORY')
        private userRepository : Repository<User>
    ){}

    public async createUser(dto: CreateUserDto){
        try {
            let response:object = {}
            const findExistUser = await this.findUserByPhoneNumber(dto.phonenumber);
            if(findExistUser){
                response = {...response, data: "User's phonenumber is existed"};
                return response;
            }
            const result = await this.userRepository
                .createQueryBuilder()
                .insert()
                .into(User)
                .values(dto)
                .execute()

            response = {...response, data: result.identifiers[0].id}
            return response;
        } catch (error) {
        console.log("🚀 ~ file: user.service.ts ~ line 17 ~ UserService ~ createUser ~ error", error)
            
        }
    }

    public async findUserByPhoneNumber(phonenumber: string): Promise<IUser>{
        try {
            const response = await this.userRepository
            .createQueryBuilder('user')
            .where('user.phonenumber = :phonenumber', {phonenumber: phonenumber})
            .getOne();
            return response;
        } catch (error) {
        console.log("🚀 ~ file: user.service.ts ~ line 26 ~ UserService ~ findUserByPhoneNumber ~ error", error)
            
        }
    }

    public async findUsers():Promise<IUser[]>{
        try {
            const response: IUser[] = await this.userRepository
            .createQueryBuilder('user')
            .getMany();
            return response;
        } catch (error) {
        console.log("🚀 ~ file: user.service.ts ~ line 49 ~ UserService ~ getAllUsers ~ error", error)
            
        }
    }

    public async findUsersByName(username: string) : Promise<IUser[]>{
        try {
            const response: IUser[] = await this.userRepository.createQueryBuilder('user')
            .where('user.fullname = :username', {username: username})
            .getMany();
            return response;
        } catch (error) {
        console.log("🚀 ~ file: user.service.ts ~ line 62 ~ UserService ~ findUsersByName ~ error", error)
            
        }
    }

    public async updateUser(dto: UpdateUserDto, userId: number){
        try {
            const findExistUser: IUser = await this.findUserByPhoneNumber(dto.phonenumber);
            if(findExistUser && findExistUser.id !==userId) return "User's phonenumber is existed"
            if(!findExistUser || findExistUser.id === userId){
                const response = await this.userRepository
                .createQueryBuilder()
                .update(User)
                .set(dto)
                .where("id = :userId", {userId: userId})
                .execute()
                return response;
            }
        } catch (error) {
        console.log("🚀 ~ file: user.service.ts ~ line 75 ~ UserService ~ updateUser ~ error", error)
            
        }
    }

    public async deleteUser(userId: number){
        try {
            const response = await this.userRepository
            .createQueryBuilder()
            .delete()
            .from(User)
            .where("id = :userId", {userId: userId})
            .execute();

            return response.affected;
        } catch (error) {
        console.log("🚀 ~ file: user.service.ts ~ line 94 ~ UserService ~ deleteUser ~ error", error)
            
        }
    }
}
