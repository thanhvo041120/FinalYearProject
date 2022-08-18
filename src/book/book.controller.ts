import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto, UpdateBookDto } from './dtos';

@Controller('book')
export class BookController {
    constructor(
        private readonly bookService: BookService
    ){}

    @Post('create')
    createBook(@Body() createDto: CreateBookDto):object{
        return this.bookService.createBook(createDto);
    }

    @Patch('update/:bookId')
    updateBook(@Body() updateDto: UpdateBookDto, @Param('bookId', ParseIntPipe) bookId: number): object{
        return this.bookService.updateBook(bookId, updateDto);
    }

    @Get('list')
    getBooks(): object{
        return this.bookService.getBooks();
    }

    @Get('booksByName')
    getBooksByName(@Query('bookName') bookName: string): object{        
        return this.bookService.getBooksByName(bookName);
    }

    @Get('bookById/:bookId')
    getBookById(@Param('bookId', ParseIntPipe) bookId: number): object{
        return this.bookService.getBookById(bookId);
    }
}
