import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import {
  CreateBookDto,
  CreateBookResponseDto,
} from 'src/api/book/dtos/addBookDtos';
import {
  UpdateBookDto,
  UpdateBookResponseDto,
} from 'src/api/book/dtos/updateBookDtos';
import { BookService } from './services/book.service';
import { IBook } from './interfaces';
import { BorrowDto, BorrowResponseDto } from './dtos/borrowBookDtos';
import { AuthService } from '../auth/auth.service';
import { BorrowBookService } from './services/borrow_book.service';
import { IAccount } from '../auth/interfaces';
import { HashDto, HashResponseDto } from './dtos/hashSADtos';
import { BookToSaService } from './services/hash_book_SA.service';
import { GetBooksFilterDto } from './dtos/getBooksDtos';
import { JwtGuard } from '../auth/guards';
import { ILike, Like } from 'typeorm';

@ApiTags('Book')
@Controller('book')
export class BookController {
  constructor(
    private readonly bookService: BookService,
    private readonly accountService: AuthService,
    private readonly borrowService: BorrowBookService,
    private readonly hashSAService: BookToSaService,
  ) {}

  @UseGuards(JwtGuard)
  @Post('create')
  async createBook(@Body() createDto: CreateBookDto, @Res() res: Response) {
    try {
      const response: CreateBookResponseDto = await this.bookService.createBook(
        createDto,
      );
      return res.status(201).json({
        data: response,
      });
    } catch (error) {
      console.log(
        '🚀 ~ file: book.controller.ts:58 ~ BookController ~ createBook ~ error',
        error,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(JwtGuard)
  @Patch('update/:bookId')
  async updateBook(
    @Body() updateDto: UpdateBookDto,
    @Param('bookId', ParseIntPipe) bookId: number,
    @Res() res: Response,
  ) {
    try {
      const existedBook: IBook = await this.bookService.getBookById(bookId);
      if (!existedBook) throw new NotFoundException('NOT FOUND');
      const response: UpdateBookResponseDto = await this.bookService.updateBook(
        bookId,
        updateDto,
        existedBook,
      );

      return res.status(200).json({
        data: response,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(JwtGuard)
  @Delete('delete/:bookId')
  async deleteBook(
    @Param('bookId', ParseIntPipe) bookId: number,
    @Res() res: Response,
  ) {
    console.log(
      '🚀 ~ file: book.controller.ts:92 ~ BookController ~ bookId',
      bookId,
    );
    try {
      const response = await this.bookService.deleteBook(bookId);
      return res.status(200).json({
        data: response,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(JwtGuard)
  @Get('list')
  async getBooks(@Res() res: Response, @Query() filter: GetBooksFilterDto) {
    try {
      if (Object.keys(filter).length > 0) {
        const response = await this.bookService.getBooks(filter);
        return res.status(200).json({
          data: response,
        });
      } else {
        const response = await this.bookService.getAllBooks('');
        return res.status(200).json({
          data: response,
        });
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(JwtGuard)
  @Get('count')
  async getBooksLength(@Res() res: Response, @Query('query') query: string) {
    try {
      let response = [];
      if (query !== undefined) {
        response = await this.bookService.getAllBooks(query);
      } else {
        response = await this.bookService.getAllBooks('');
      }

      return res.status(200).json({
        data: response.length,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(JwtGuard)
  @Get('length/:categoryId')
  async getBooksLengthByCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Res() res: Response,
    @Query('query') query: string,
  ) {
    try {
      if (query !== undefined) {
        const response = await this.bookService.getAllBooksByCategoryId(
          query,
          categoryId,
        );
        return res.status(200).json({
          data: response.length,
        });
      } else {
        const response = await this.bookService.getAllBooksByCategoryId(
          "",
          categoryId,
        );
        return res.status(200).json({
          data: response.length,
        });
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(JwtGuard)
  @Get('booksByName')
  async getBooksByName(
    @Query('bookName') bookName: string,
    @Res() res: Response,
  ) {
    try {
      const response: IBook[] = await this.bookService.getBooksByName(bookName);
      return res.status(200).json({
        message: 'Success',
        data: response,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(JwtGuard)
  @Get('bookById/:bookId')
  async getBookById(
    @Param('bookId', ParseIntPipe) bookId: number,
    @Res() res: Response,
  ) {
    try {
      const response = await this.bookService.getBookById(bookId);
      return res.status(200).json({
        message: 'Success',
        data: response,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(JwtGuard)
  @Get('bookByCategory/:categoryId')
  async getBookByCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Query() filter: GetBooksFilterDto,
    @Res() res: Response,
  ) {
    try {
      const response = await this.bookService.getBooksByCategory(
        categoryId,
        filter,
      );
      return res.status(200).json({
        message: 'Success',
        data: response,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(JwtGuard)
  @Post('borrow')
  async borrowBook(@Body() dto: BorrowDto, @Res() res: Response) {
    try {
      const account: IAccount[] =
        await this.accountService.findAccountsByOption({ email: dto.email });

      const address = await this.hashSAService.getDetailByOptions({
        hashSA: dto.SA,
      });
      const response: BorrowResponseDto = await this.borrowService.borrowBook(
        account[0].id,
        address[0].address,
        dto.expDate,
        dto.bookName,
      );
      return res.status(201).json({
        data: response,
      });
    } catch (error) {
      console.log(
        '🚀 ~ file: book.controller.ts:224 ~ BookController ~ borrowBook ~ error',
        error.message,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(JwtGuard)
  @Delete('deleteFailBorrow/:borrowId')
  async deleteFailedBorrow (
    @Param('borrowId') borrowId: number,
    @Res() res: Response
  ) {
    try {
      const response = await this.borrowService.deleteFailBorrowBook(borrowId);
      return res.status(200).json({
        data: response.affected
      })
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(JwtGuard)
  @Post('hash/:staffWallet')
  async hashSA(
    @Body() dto: HashDto,
    @Res() res: Response,
    @Param('staffWallet', ParseIntPipe) staffId: number,
  ) {
    try {
      const response: HashResponseDto = await this.hashSAService.createSA(dto);
      if (response.affectedRow.length > 0) {
        response.affectedRow.forEach(async (item) => {
          try {
            const date = new Date();
            date.setDate(date.getDate() + dto.expLength);
            await this.borrowService.borrowBook(
              staffId,
              item,
              date,
              dto.bookName,
            );
          } catch (error) {
            console.log(
              '🚀 ~ file: book.controller.ts:245 ~ BookController ~ response.affectedRow.forEach ~ error',
              error.message,
            );
          }
        });
      }
      return res.status(201).json({
        data: response,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(JwtGuard)
  @Get('books/SADetails/:bookId')
  async getSADetail(
    @Res() res: Response,
    @Param('bookId', ParseIntPipe) bookId: number,
  ) {
    try {
      const response = await this.hashSAService.getDetailByOptions({
        bookId: bookId,
      });
      return res.status(200).json({
        data: response,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(JwtGuard)
  @Get('borrowersOverDate')
  async getBorrowerOverExpDate (@Res() res: Response) {
    try {
      const now = new Date()
      const response = await this.borrowService.findBorrow("borrow.expDate > :now", {now: now})
      return res.status(200).json({
        data: response
      })
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(JwtGuard)
  @Get('borrowers')
  async getBorrowers (@Res() res: Response) {
    try {
      const response = await this.borrowService.findBorrow("", {})
      return res.status(200).json({
        data: response
      })
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
