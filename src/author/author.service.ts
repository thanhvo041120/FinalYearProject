import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repositoties } from 'src/utils/constants';
import { CreateAuthorDto } from 'src/utils/dtos/authors/addAuthorDtos';
import { Repository } from 'typeorm';
import { Author } from './entities';

@Injectable()
export class AuthorService {
    constructor(
        @Inject(Repositoties.AUTHOR)
        private authorRepository: Repository<Author>
    ){}

    protected Authors: Author[] = new Array<Author>();

    public async createAuthor(_dto: CreateAuthorDto){
        try {
            const author = new Author();
            author.name = _dto.name;
            const result = await this.authorRepository.save(author)
            console.log("🚀 ~ file: author.service.ts ~ line 21 ~ AuthorService ~ createAuthor ~ result", result)

            
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
    }

    public async findUser(authorId: number){
        try {
            const response = await this.authorRepository.findOneBy({id: authorId});
            console.log("🚀 ~ file: author.service.ts ~ line 32 ~ AuthorService ~ findUser ~ response", response)

            return response
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
    }

}
