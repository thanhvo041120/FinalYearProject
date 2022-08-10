import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, RegisterDto } from './dtos';

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
}
