import { Inject, Injectable } from '@nestjs/common';
import { Repositoties } from 'src/utils/constants';
import {
  CreateBookDto,
  CreateBookResponseDto,
} from 'src/api/book/dtos/addBookDtos';
import {
  UpdateBookDto,
  UpdateBookResponseDto,
} from 'src/api/book/dtos/updateBookDtos';
import { Repository } from 'typeorm';
import { Book } from '../entities';
import { IBook } from '../interfaces';
import { AuthorService } from 'src/api/author/author.service';
import { GetBooksFilterDto } from 'src/api/book/dtos/getBooksDtos';

@Injectable()
export class BookService {
  constructor(
    @Inject(Repositoties.BOOK)
    private readonly bookRepository: Repository<Book>,
    private readonly authorService: AuthorService,
  ) {}

  public async createBook(dto: CreateBookDto): Promise<CreateBookResponseDto> {
    const newBook = new Book();
    newBook.name = dto.name;
    newBook.total = dto.total;
    newBook.authorId = dto.authorId;
    newBook.categoryId = dto.categoryId;
    newBook.expLength = dto.expLength;
    newBook.image = dto.image;
    if (dto.description === '') {
      newBook.description = null;
    } else {
      newBook.description = dto.description;
    }
    const response = await this.bookRepository
      .createQueryBuilder()
      .insert()
      .into(Book)
      .values(newBook)
      .execute();
    return {
      message: 'Success',
      bookId: response.identifiers[0].id,
    };
  }

  public async updateBook(
    bookId: number,
    dto: UpdateBookDto,
    bookInDatabase: IBook,
  ): Promise<UpdateBookResponseDto> {
    const updateBook = Object.assign(bookInDatabase, dto);
    const response = await this.bookRepository
      .createQueryBuilder('book')
      .update(Book)
      .set(updateBook)
      .where('book.id = :bookId', { bookId: bookId })
      .execute();
    return {
      message: 'success',
      affectedRow: response.affected,
    };
  }

  public async deleteBook(bookId: number): Promise<object> {
    const response = await this.bookRepository
      .createQueryBuilder('book')
      .delete()
      .from(Book)
      .where('book.id = :bookId', { bookId: bookId })
      .execute();

    return {
      message: 'success',
      data: response.affected,
    };
  }

  public async getBooks(filter: GetBooksFilterDto) {
    if (filter.query) {
      const response = await this.bookRepository
        .createQueryBuilder('book')
        .where('LOWER(book.name) like LOWER(:filter)', {
          filter: `%${filter.query}%`,
        })
        .orWhere('LOWER(book.description) like LOWER(:filter)', {
          filter: `%${filter.query}%`,
        })
        .skip((filter.page - 1) * filter.limit)
        .take(filter.limit)
        .getMany();
      return response;
    }
    const response = await this.bookRepository
      .createQueryBuilder('book')
      .skip((filter.page - 1) * filter.limit)
      .take(filter.limit)
      .getMany();
    return response;
  }

  public async getAllBooks(filter: string) {
    if (filter.length > 0) {
      const response = await this.bookRepository
        .createQueryBuilder('book')
        .where('LOWER(book.name) like LOWER(:filter)', {
          filter: `%${filter}%`,
        })
        .orWhere('LOWER(book.description) like LOWER(:filter)', {
          filter: `%${filter}%`,
        })
        .getMany();

      return response;
    }
    const response = await this.bookRepository
      .createQueryBuilder('book')
      .getMany();

    return response;
  }

  public async getBooksByCategory(
    categoryId: number,
    filter: GetBooksFilterDto,
  ): Promise<IBook[]> {
    if (filter.query) {
      const response: IBook[] = await this.bookRepository
        .createQueryBuilder('book')
        .where('book.categoryId = :categoryId', { categoryId: categoryId })
        .where('LOWER(book.name) like LOWER(:filter)', {
          filter: `%${filter.query}%`,
        })
        .orWhere('LOWER(book.description) like LOWER(:filter)', {
          filter: `%${filter.query}%`,
        })
        .skip((filter.page - 1) * filter.limit)
        .take(filter.limit)
        .getMany();

      return response;
    }
    const response: IBook[] = await this.bookRepository
      .createQueryBuilder('book')
      .where('book.categoryId = :categoryId', { categoryId: categoryId })
      .skip((filter.page - 1) * filter.limit)
      .take(filter.limit)
      .getMany();

    return response;
  }

  public async getAllBooksByCategoryId(filter: string, categoryId: number) {
    if (filter.length > 0) {
      const response = await this.bookRepository
        .createQueryBuilder('book')
        .where('book.categoryId = :categoryId', { categoryId: categoryId })
        .where('LOWER(book.name) like LOWER(:filter)', {
          filter: `%${filter}%`,
        })
        .orWhere('LOWER(book.description) like LOWER(:filter)', {
          filter: `%${filter}%`,
        })
        .getMany();

      return response;
    }
    const response = await this.bookRepository
      .createQueryBuilder('book')
      .where('book.categoryId = :categoryId', { categoryId: categoryId })
      .getMany();

    return response;
  }

  public async getBooksByName(bookName: string): Promise<IBook[]> {
    const response: IBook[] = await this.bookRepository
      .createQueryBuilder('book')
      .where("book.name like '%' || :bookName || '%'", { bookName: bookName })
      .getRawMany();

    return response;
  }

  public async getBookById(bookId: number): Promise<IBook> {
    const response: IBook = await this.bookRepository
      .createQueryBuilder('book')
      .where('book.id = :bookId', { bookId: bookId })
      .getOne();
    return response;
  }
}
