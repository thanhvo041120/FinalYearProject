import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateAuthorDto } from 'src/utils/dtos/authors/addAuthorDtos';
import { AuthorService } from './author.service';

@Controller('author')
@ApiTags('Author')
export class AuthorController {
    constructor(
        private authorService : AuthorService,
    ){}

    @Post('/create')
    createAuthor(@Body() _createAuthorDto: CreateAuthorDto ){
        return this.authorService.createAuthor(_createAuthorDto);
    }

    @Get('/:authorId')
    findUser(@Param('authorId', ParseIntPipe) authorId: number){
        return this.authorService.findUser(authorId)
    }
}
