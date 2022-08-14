import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthDto, RegisterDto } from './dtos';
import { JwtRefreshGuard } from './guards';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ){}

    @Post('register')
    async register(@Body() dto: RegisterDto): Promise<any> {
        const response = await this.authService.register(dto);
        return response;
    }

    @Post('login')
    async login (@Body() dto: AuthDto):Promise<any>{
        const response = await this.authService.login(dto);
        return response;
    }

    @UseGuards(JwtRefreshGuard)
    @Post('refresh')
    async refreshToken(@Req()req: Request){
        const user =req.user;
        return await this.authService.refreshToken(user["email"], user["refreshToken"]);
    }
}
