import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/database/database.module';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { authProviders } from './auth.provider';
import { AuthService } from './auth.service';

@Module({
    imports: [DatabaseModule, UserModule,JwtModule.register({})],
    controllers: [AuthController],
    providers: [AuthService, ...authProviders],
    exports: [...authProviders, AuthService]
})
export class AuthModule {}
