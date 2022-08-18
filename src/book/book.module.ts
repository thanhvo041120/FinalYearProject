import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { BookController } from './book.controller';
import { bookProviders } from './book.provider';
import { BookService } from './book.service';

@Module({
  imports: [DatabaseModule],
  controllers: [BookController],
  providers: [BookService, ...bookProviders]
})
export class BookModule {}
