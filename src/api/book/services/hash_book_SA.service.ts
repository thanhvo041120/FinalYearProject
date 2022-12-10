import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repositoties } from 'src/utils/constants';
import { Repository } from 'typeorm';
import { HashDto, HashResponseDto } from '../dtos/hashSADtos';
import { BookToSA, Borrow } from '../entities';
import { Md5 } from 'ts-md5';

@Injectable()
export class BookToSaService {
  constructor(
    @Inject(Repositoties.HASHSA)
    private readonly bookToSaRepository: Repository<BookToSA>,
  ) {}

  public async createSA(dto: HashDto): Promise<HashResponseDto> {
    let response=[];
    if(dto.address.length > 0){
      for await (let item of dto.address){
        const hashSA: string = this.hash(item);
        const result = await this.bookToSaRepository
        .createQueryBuilder()
        .insert()
        .into(BookToSA)
        .values([
          {
            address: item,
            bookId: dto.bookId,
            hashSA: hashSA,
          },
        ])
        .execute();
        response.push(result.identifiers[0].address);
      }
    }  
    if(dto.address.length === 0){
      response = [];
    } 
    return {
      message: 'Success',
      affectedRow: response,
    };
  }

  public async getDetailByOptions(options: object){
    const response = await this.bookToSaRepository.createQueryBuilder('hash')
    .where(options)
    .getMany();
    return response;
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
