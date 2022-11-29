import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RoleModule } from './api/role/role.module';
import { DatabaseModule } from './api/database/database.module';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './api/auth/auth.module';
import { BookModule } from './api/book/book.module';
import { CategoryModule } from './api/category/category.module';
import { AuthorModule } from './api/author/author.module';
import { MailModule } from './api/mail/mail.module';

@Module({
  imports: [
    RoleModule,
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UserModule,
    AuthModule,
    BookModule,
    CategoryModule,
    AuthorModule,
    MailModule,
  ],
})
export class AppModule {}
