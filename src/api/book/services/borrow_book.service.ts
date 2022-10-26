import { Inject, Injectable } from '@nestjs/common';
import { Repositoties } from 'src/utils/constants';
import { Repository } from 'typeorm';
import { BorrowResponseDto } from '../dtos/borrowBookDtos';
import { Borrow } from '../entities';

@Injectable()
export class BorrowBookService {
    constructor(
        @Inject(Repositoties.BORROW)
        private readonly borrowRepository: Repository<Borrow>
    ){}

    public async borrowBook(accountId: number, SA: string): Promise<BorrowResponseDto>{
        const response = await this.borrowRepository.createQueryBuilder()
        .insert()
        .into(Borrow)
        .values([{
            accountId: accountId,
            bookToSAString: SA
        }])
        .execute();

        return {
            message: 'Success',
            affectedRow: response.raw,
        }
    }
}
