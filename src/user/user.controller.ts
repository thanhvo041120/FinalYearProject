import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { UserDto } from './dtos';
import { UpdateUserDto } from './dtos/updateuser.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(
        private userService: UserService
    ){}

    @Get()
    async getUsers(){
        const response = await this.userService.findUsers();
        return {
            data: response,
            status: HttpCode(200)
        }
    }
    
    @Get('search/name/:username')
    async getUsersByName(@Param('username') username : string){
        const response = await this.userService.findUsersByName(username);
        return {
            data: response,
            status: HttpCode(200)
        }
    }

    @Get('search/phonenumber/:phonenumber')
    async getUserByPhoneNumber(@Param('phonenumber') phonenumber: string){
        console.log("🚀 ~ file: user.controller.ts ~ line 41 ~ UserController ~ getUserByPhoneNumber ~ phonenumber", phonenumber)
        const response = await this.userService.findUserByPhoneNumber(phonenumber);
        return {
            data: response,
            status: HttpCode(200)
        }
    }

    @Put('update/:userId')
    async updateUser(@Body() dto: UpdateUserDto, @Param('userId') userId: string){
        const parsedId = parseInt(userId);
        const response = await this.userService.updateUser(dto, parsedId);
        if(response === "User's phonenumber is existed") return new HttpException(response, HttpStatus.CONFLICT);
        return {
            data: response,
            status: HttpCode(200)
        };
    }

    @Delete('delete/:userId')
    async deleteUser(@Param('userId') userId: string){
        const parsedId = parseInt(userId);
        const response = await this.userService.deleteUser(parsedId);
        return{
            data: response,
            status: HttpCode(200)
        }
    }
}
