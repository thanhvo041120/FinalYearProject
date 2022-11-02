import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { RoleService } from 'src/api/role/role.service';
import { UserService } from 'src/api/user/user.service';
import {
  AuthDto,
  AuthResponseDto,
} from 'src/api/auth/dtos/authDtos';
import { RegisterDto } from 'src/api/auth/dtos/registerDtos';
import { AuthService } from './auth.service';
import { JwtGuard, JwtRefreshGuard } from './guards';
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto, @Res() res: Response) {
    try {
      const userDetail = await this.userService.findUserByPhoneNumber(dto.phonenumber);
      if(userDetail) return res.status(409).json({message: "User's phonenumber is existed"});
      
      const account = await this.authService.findAccountsByOption({email: dto.email});
      if(account.length > 0)  return res.status(409).json({message: "User's email is existed"});
      const response = await this.authService.register(dto);
      return res.status(201).json({
        data: response,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Post('login')
  async login(@Body() dto: AuthDto, @Res() res: Response) {
    try {
      const account = await this.authService.findAccountsByOption({
        email: dto.email,
      });
      if (account.length === 0) {
        return res.status(401).json({
          message: 'Credentials incorrect',
        });
      }
      const response: AuthResponseDto = await this.authService.login(
        dto,
        account[0],
      );
      if (response.status === 401)
        return res.status(401).json({
          message: 'Password incorrect',
        });
      return res.status(response.status).json({
        tokens: response.tokens,
        accountId: account[0].id,
        email: account[0].email,
        roleId: account[0]['roleId'],
      });
    } catch (error) {
      return new InternalServerErrorException('Internal Server Error');
    }
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refreshToken(@Req() req: Request) {
    const user = req.user;
    return await this.authService.refreshToken(
      user['email'],
      user['refreshToken'],
    );
  }

  @UseGuards(JwtGuard)
  @Post('logout')
  async logout(@Req() req: Request){
    try {
      const account = req.user;
      console.log("🚀 ~ file: auth.controller.ts ~ line 89 ~ AuthController ~ logout ~ account", account)
      await this.authService.logout(account['refreshToken']);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
