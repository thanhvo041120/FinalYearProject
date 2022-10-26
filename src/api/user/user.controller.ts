import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  UseGuards,
  Res,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtGuard } from 'src/api/auth/guards';
import {
  UpdateUserDto,
  UpdateUserResponseDto,
} from 'src/api/user/dtos/updateUserDtos';
import { IUser } from './interfaces/user.interface';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  //   @UseGuards(JwtGuard)
  @Get('findAll')
  async getUsers(@Res() res: Response) {
    try {
      const response: IUser[] = await this.userService.findUsers();
      return res.status(200).json({
        data: response,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  //   @UseGuards(JwtGuard)
  @Get('search/name/:username')
  async getUsersByName(
    @Param('username') username: string,
    @Res() res: Response,
  ) {
    try {
      const response = await this.userService.findUsersByOption({
        fullname: username,
      });
      return res.status(200).json({
        data: response,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get('search/phonenumber/:phonenumber')
  async getUserByPhoneNumber(
    @Param('phonenumber') phonenumber: string,
    @Res() res: Response,
  ) {
    try {
      const response = await this.userService.findUserByPhoneNumber(
        phonenumber,
      );
      return res.status(200).json({
        data: response,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Patch('update/:userId')
  async updateUser(
    @Body() dto: UpdateUserDto,
    @Param('userId', ParseIntPipe) userId: number,
    @Res() res: Response,
  ) {
    try {
      const findExistUser: IUser = await this.userService.findUserByPhoneNumber(
        dto?.phonenumber,
      );
      if (findExistUser && findExistUser.id !== userId)
        return res
          .status(401)
          .json({ message: "User's phonenumber is existed" });

      const response: UpdateUserResponseDto = await this.userService.updateUser(
        dto,
        userId,
      );
      return res.status(200).json({
        data: response,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Delete('delete/:userId')
  async deleteUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Res() res: Response,
  ) {
    try {
      const response: number = await this.userService.deleteUser(userId);
      return res.status(200).json({
        data: response,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
