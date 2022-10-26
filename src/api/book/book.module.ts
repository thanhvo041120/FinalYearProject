import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/api/database/database.module';
import { AuthModule } from '../auth/auth.module';
import { AuthorModule } from '../author/author.module';
import { CategoryModule } from '../category/category.module';
import { BookController } from './book.controller';
import { bookProviders } from './book.provider';
import { BookService } from './services/book.service';
import { BorrowBookService } from './services/borrow_book.service';
import { BookToSaService } from './services/hash_book_SA.service';

@Module({
  imports: [DatabaseModule, AuthorModule, CategoryModule, AuthModule],
  controllers: [BookController],
  providers: [BorrowBookService,BookService, ...bookProviders, BookToSaService]
})
export class BookModule {}
