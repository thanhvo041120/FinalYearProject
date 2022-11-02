import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/api/database/database.module';
import { UserModule } from 'src/api/user/user.module';
import { AuthController } from './auth.controller';
import { authProviders } from './auth.provider';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtRefreshTokenStrategy, JwtAccessTokenStrategy } from './strategies';
import { JwtGuard } from './guards';
import { RoleModule } from 'src/api/role/role.module';
@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => UserModule),
    JwtModule.register({}),
    PassportModule,
    RoleModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    ...authProviders,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
    JwtGuard,
  ],
  exports: [AuthService],
})
export class AuthModule {}
