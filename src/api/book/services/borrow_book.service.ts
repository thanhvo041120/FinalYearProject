import { Inject, Injectable } from '@nestjs/common';
import { Repositoties } from 'src/utils/constants';
import { Repository } from 'typeorm';
import { BorrowResponseDto } from '../dtos/borrowBookDtos';
import { Book, Borrow } from '../entities';

@Injectable()
export class BorrowBookService {
  constructor(
    @Inject(Repositoties.BORROW)
    private readonly borrowRepository: Repository<Borrow>,
  ) {}

  public async borrowBook(
    accountId: number,
    address: string,
    expDate: Date,
    bookName: string
  ): Promise<BorrowResponseDto> {
    const response = await this.borrowRepository
      .createQueryBuilder()
      .insert()
      .into(Borrow)
      .values([
        {
          accountId: accountId,
          bookToSAString: address,
          expDate: expDate,
          bookName: bookName
        },
      ])
      .execute()
    return {
      message: 'Success',
      affectedRow: response.raw,
    };
  }
  public async deleteFailBorrowBook (borrowId: number){
    const response = await this.borrowRepository.createQueryBuilder()
    .delete()
    .from(Borrow)
    .where('id = :borrowId', {borrowId: borrowId})
    .execute();
    return response;
  }

  public async findBorrow (alias: string, option: object){
    const response = await this.borrowRepository.createQueryBuilder('borrow')
    .where(alias, option)
    .leftJoinAndSelect('borrow.account', 'account')
    .leftJoinAndSelect(Book,'book', 'book.name = borrow.bookName')
    .getMany()
    console.log("🚀 ~ file: borrow_book.service.ts:53 ~ BorrowBookService ~ findBorrow ~ response", response)
    return response;
  }
}
