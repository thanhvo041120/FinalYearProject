import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthDto, RegisterDto } from './dtos';
import { JwtRefreshGuard } from './guards';
import { IToken } from './interfaces';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<any> {
    try {
      const response = await this.authService.register(dto);
      return response;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('login')
  async login(@Body() dto: AuthDto): Promise<IToken | object> {
    try {
      const response = await this.authService.login(dto);
      return response;
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
}
