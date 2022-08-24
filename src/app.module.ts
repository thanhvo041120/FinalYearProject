import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RoleModule } from './role/role.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BookModule } from './book/book.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [RoleModule, ConfigModule.forRoot({isGlobal: true}), DatabaseModule, UserModule, AuthModule, BookModule, CategoryModule],
})
export class AppModule {}
