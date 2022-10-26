import { Inject, Injectable } from "@nestjs/common";
import { Repositoties } from "src/utils/constants";
import { Repository } from 'typeorm';
import { HashDto, HashResponseDto } from "../dtos/hashSADtos";
import { BookToSA } from "../entities";
import * as argon from 'argon2';

@Injectable()
export class BookToSaService{
    constructor(
        @Inject(Repositoties.HASHSA)
        private readonly bookToSaRepository: Repository<BookToSA>
    ){}

    public async createSA (dto: HashDto): Promise<HashResponseDto>{
        const hashSA: string = await this.hash(dto.address);
        const response = await this.bookToSaRepository.createQueryBuilder()
        .insert()
        .into(BookToSA)
        .values([{
            address: dto.address,
            bookId: dto.bookId,
            hashSA: hashSA
        }])
        .execute();
        return {
            message: 'Success',
            affectedRow: response.raw,
        }
    }

    private async hash(address: string): Promise<string>{
        const hashAddress: string =  await argon.hash(address);
        return hashAddress;
    }
}