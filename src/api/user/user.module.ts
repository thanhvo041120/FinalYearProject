import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/api/database/database.module';
import { AuthModule } from 'src/api/auth/auth.module';
import { UserController } from './user.controller';
import { userProviders } from './user.provider';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule, forwardRef(() => AuthModule),],
  controllers: [UserController],
  providers: [UserService,...userProviders],
  exports: [...userProviders, UserService]
})
export class UserModule {}
