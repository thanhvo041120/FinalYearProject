import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repositoties } from 'src/utils/constants';
import { Repository } from 'typeorm';
import { HashDto, HashResponseDto } from '../dtos/hashSADtos';
import { BookToSA } from '../entities';
import { Md5 } from 'ts-md5';

@Injectable()
export class BookToSaService {
  constructor(
    @Inject(Repositoties.HASHSA)
    private readonly bookToSaRepository: Repository<BookToSA>,
  ) {}

  public async createSA(dto: HashDto): Promise<HashResponseDto> {
    const hashSA: string = this.hash(dto.address);
    const response = await this.bookToSaRepository
      .createQueryBuilder()
      .insert()
      .into(BookToSA)
      .values([
        {
          address: dto.address,
          bookId: dto.bookId,
          hashSA: hashSA,
        },
      ])
      .execute();
    return {
      message: 'Success',
      affectedRow: response.raw,
    };
  }

  private hash(address: string): string{
    try {
        const source = {
            time: Date.now(),
            address: address,
        }
        const hashJSON = (source) => Md5.hashStr(JSON.stringify(source));
        const hashSA: string =  hashJSON(source);
        return hashSA;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
