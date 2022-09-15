import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards';
import { UpdateUserDto } from 'src/utils/dtos/users/updateUserDtos';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('users')
export class UserController {
    constructor(
        private userService: UserService
    ){}

    @UseGuards(JwtGuard)
    @Get()
    async getUsers(){
        const response = await this.userService.findUsers();
        return {
            data: response,
            status: HttpCode(200)
        }
    }
    
    @UseGuards(JwtGuard)
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
