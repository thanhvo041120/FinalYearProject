import { HttpStatus, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateBookDto, UpdateBookDto } from './dtos';
import { Book } from './entities';

@Injectable()
export class BookService {
    constructor(
        @Inject('BOOK_REPOSITORY')
        private readonly bookRepository: Repository<Book>
    ){}

    public async createBook(dto: CreateBookDto):Promise<object>{
        try {            
            const newBook = new Book();
            newBook.name = dto.name;
            newBook.total = dto.total;
            newBook.restInStock = dto.restInStock;

            if(dto.description === undefined){
                newBook.description = null;
            }else{
                newBook.description = dto.description;
            }
            await this.bookRepository.createQueryBuilder()
            .insert()
            .into(Book)
            .values(newBook)
            .execute();
            
            return {
                message: "Success",
                status: HttpStatus.CREATED
            }
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    public async updateBook(bookId: number, dto: UpdateBookDto){
        try {
            const bookInDatabase = await this.bookRepository.createQueryBuilder('book')
            .where('book.id = :bookId',{bookId: bookId})
            .getOne();


            if(!bookInDatabase) throw new NotFoundException('NOT FOUND');

            const updateBook = Object.assign(bookInDatabase, dto);

            const response = await this.bookRepository.createQueryBuilder('book')
            .update(Book)
            .set(updateBook)
            .where('book.id = :bookId', {bookId: bookId})
            .execute();


            return {
                message: 'success',
                data: response.affected,
                status: HttpStatus.OK
            }
            
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    public async getBooks():Promise<object>{
        try {
            const response = await this.bookRepository.createQueryBuilder('book')
            .getMany();

            return {
                message: 'success',
                data: response,
                status: HttpStatus.OK
            }
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
    }

    public async getBooksByName(bookName: string):Promise<object>{
        try {
            const response = await this.bookRepository.createQueryBuilder('book')
            .where("book.name like '%' || :bookName || '%'", {bookName: bookName})
            .getRawMany()

            if(response.length === 0) return new NotFoundException();

            return {
                message: 'success',
                data: response,
                status: HttpStatus.OK
            }
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
    }

    public async getBookById(bookId: number): Promise<object>{
        try {
            const response = await this.bookRepository.createQueryBuilder('book')
            .where('book.id = :bookId', {bookId: bookId})
            .getRawOne();
            console.log("🚀 ~ file: book.service.ts ~ line 105 ~ BookService ~ getBookById ~ response", response)

            if(!response) return new NotFoundException();

            return{
                message: 'success',
                data: response,
                status: HttpStatus.OK
            }
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    public async deleteBook(bookId: number): Promise<object>{
        try {
            const response = await this.bookRepository.createQueryBuilder('book')
            .delete()
            .from(Book)
            .where("book.id = :bookId", {bookId: bookId})
            .execute();


            return{
                message: 'success',
                data: response.affected,
                status: HttpStatus.OK,
            }
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
    }
}
