import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/api/database/database.module';
import { AuthorController } from './author.controller';
import { authorProviders } from './author.provider';
import { AuthorService } from './author.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthorController],
  providers: [AuthorService, ...authorProviders],
  exports: [AuthorService]
})
export class AuthorModule {}
