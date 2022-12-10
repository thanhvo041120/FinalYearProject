import {
  Body,
  Controller,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UserService } from 'src/api/user/user.service';
import { AuthDto, AuthResponseDto } from 'src/api/auth/dtos/authDtos';
import { RegisterDto } from 'src/api/auth/dtos/registerDtos';
import { AuthService } from './auth.service';
import { JwtGuard, JwtRefreshGuard } from './guards';
import { ChangePasswordDto, ResetPasswordDto } from './dtos/changePasswordDto';
import { Get } from '@nestjs/common/decorators/http/request-mapping.decorator';
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
      const userDetail = await this.userService.findUserByPhoneNumber(
        dto.phonenumber,
      );
      if (userDetail)
        return res
          .status(409)
          .json({ message: "User's phonenumber is existed" });

      const account = await this.authService.findAccountsByOption({
        email: dto.email,
      });
      if (account.length > 0)
        return res.status(409).json({ message: "User's email is existed" });
      const existedWallet = await this.authService.findAccountsByOption({
        walletAddress: dto.walletAddress,
      });
      if (existedWallet.length > 0) {
        return res.status(409).json({
          message: 'Wallet has already registered',
        });
      }

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
        account[0]['password'],
        account[0]['id'],
      );
      console.log(
        '🚀 ~ file: auth.controller.ts:78 ~ AuthController ~ login ~ response',
        response,
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
        walletAddress: account[0]['walletAddress'],
      });
    } catch (error) {
      return new InternalServerErrorException('Internal Server Error');
    }
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const user = req.user;
    const response = await this.authService.refreshToken(
      user['email'],
      user['refreshToken'],
    );

    if (response.status === 403) {
      return res.status(401).json({
        data: response.message,
      });
    }
    return res.status(201).json({
      data: response.message,
    });
  }

  @UseGuards(JwtRefreshGuard)
  @Post('logout')
  async logout(@Req() req: Request) {
    try {
      const account = req.user;
      await this.authService.logout(account['refreshToken']);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(JwtGuard)
  @Post('changePassword/:accountId')
  async changePassword(
    @Param('accountId', ParseIntPipe) accountId: number,
    @Body() dto: ChangePasswordDto,
    @Res() res: Response,
  ) {
    try {
      const account = await this.authService.findAccountsByOption({
        id: accountId,
      });
      const isCorrectOldPassword = await this.authService.verifyPassword(
        dto.oldPassword,
        account[0].password,
      );
      if (!isCorrectOldPassword) {
        return res.status(406).json({
          data: 'Incorrect old password',
        });
      }
      const response = await this.authService.changePassword(
        dto.newPassword,
        accountId,
      );
      if (response.affected <= 0) {
        return res.status(406).json({
          data: 'Failed to change password',
        });
      }
      return res.status(200).json({
        data: response.affected,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  @UseGuards(JwtGuard)
  @Post('reset/:accountId')
  async resetPassword(
    @Param('accountId', ParseIntPipe) accountId: number,
    @Body() dto: ResetPasswordDto,
    @Res() res: Response,
  ) {
    try {
      const response = await this.authService.changePassword(
        dto.newPassword,
        accountId,
      );
      if (response.affected <= 0) {
        return res.status(406).json({
          data: 'Failed to change password',
        });
      }
      return res.status(200).json({
        data: response.affected,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  @UseGuards(JwtGuard)
  @Get('all')
  async getAllAccount(@Res() res: Response) {
    try {
      const response = await this.authService.findAccountsByOption({});
      return res.status(200).json({
        data: response
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
