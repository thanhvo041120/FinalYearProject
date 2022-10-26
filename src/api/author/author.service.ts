import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repositoties } from '../../utils/constants';
import { CreateAuthorDto } from '../../api/author/dtos/addAuthorDtos';
import { Repository } from 'typeorm';
import { Author } from './entities';
import { CreateAuthorResponseDto } from './dtos/addAuthorDtos/addAuthor-Response.dto';
import {
  UpdateAuthorDto,
  UpdateAuthorResponseDto,
} from './dtos/updateAuthorDtos';
import { IAuthor } from './interfaces/author.interface';

@Injectable()
export class AuthorService {
  constructor(
    @Inject(Repositoties.AUTHOR)
    private authorRepository: Repository<Author>,
  ) {}

  public async createAuthor(
    dto: CreateAuthorDto,
  ): Promise<CreateAuthorResponseDto> {
    const response: object = await this.authorRepository
      .createQueryBuilder()
      .insert()
      .into(Author)
      .values([
        {
          name: dto.name,
        },
      ])
      .execute();
    return {
      message: 'Success',
      affectedRow: response['identifiers'][0].id,
    };
  }

  public async updateAuthor(
    dto: UpdateAuthorDto,
    authorId: number,
  ): Promise<UpdateAuthorResponseDto> {
    const response = await this.authorRepository
      .createQueryBuilder('Author')
      .update(Author)
      .set({
        name: dto.name,
      })
      .where('Author.id = :authorId', { authorId: authorId })
      .execute();
    return {
      message: 'Success',
      affectedRow: response.affected,
    };
  }

  public async deleteAuthor(authorId: number): Promise<number>{
    const response = await this.authorRepository.createQueryBuilder()
    .delete()
    .from(Author)
    .where('id = :authorId ', {authorId: authorId})
    .execute();
    return response.affected;
  }

  public async getAuthors(): Promise<IAuthor[]> {
    const response: IAuthor[] = await this.authorRepository
      .createQueryBuilder()
      .getMany();
    return response;
  }

  public async findAuthorById(authorId: number): Promise<IAuthor> {
    const response: IAuthor = await this.authorRepository.findOneBy({
      id: authorId,
    });
    return response;
  }

  public async findAuthorsByOption(option: object): Promise<IAuthor[]>{
    const response: IAuthor[] = await this.authorRepository.createQueryBuilder()
    .where(option)
    .getMany();
    return response;
  }
}
