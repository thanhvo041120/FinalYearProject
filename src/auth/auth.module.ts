import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/database/database.module';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { authProviders } from './auth.provider';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtRefreshTokenStrategy, JwtAccessTokenStrategy } from './strategies';
import { JwtGuard } from './guards';
@Module({
    imports: [DatabaseModule, UserModule,JwtModule.register({}), PassportModule],
    controllers: [AuthController],
    providers: [AuthService, ...authProviders, JwtAccessTokenStrategy, JwtRefreshTokenStrategy, JwtGuard],
    exports: [...authProviders, AuthService]
})
export class AuthModule {}
