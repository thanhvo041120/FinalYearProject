import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateAuthorDto, CreateAuthorResponseDto } from './dtos/addAuthorDtos';
import { AuthorService } from './author.service';
import {
  UpdateAuthorDto,
  UpdateAuthorResponseDto,
} from './dtos/updateAuthorDtos';
import { IAuthor } from './interfaces';

@Controller('author')
@ApiTags('Author')
export class AuthorController {
  constructor(private authorService: AuthorService) {}

  @Post('/create')
  async createAuthor(@Body() dto: CreateAuthorDto, @Res() res: Response) {
    try {
      const response: CreateAuthorResponseDto =
        await this.authorService.createAuthor(dto);
      return res.status(201).json({
        data: response,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Patch('/update/:authorId')
  async updateAuthor(
    @Body() dto: UpdateAuthorDto,
    @Param('authorId', ParseIntPipe) authorId,
    @Res() res: Response,
  ) {
    try {
      const response: UpdateAuthorResponseDto =
        await this.authorService.updateAuthor(dto, authorId);
      return res.status(200).json({
        data: response,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Delete('delete/:authorId')
  async deleteAuthor(
    @Param('authorId', ParseIntPipe) authorId: number,
    @Res() res: Response,
  ) {
    try {
      const response: number = await this.authorService.deleteAuthor(authorId);
      return res.status(200).json({
        data: {
          affectedRow: response
        }
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  @Get('authors')
  async getAuthors(@Res() res: Response) {
    try {
      const response: IAuthor[] = await this.authorService.getAuthors();
      return res.status(200).json({
        data: response,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get('getAuthor/:authorId')
  async findAuthorById(
    @Param('authorId', ParseIntPipe) authorId: number,
    @Res() res: Response,
  ) {
    try {
      const response: IAuthor = await this.authorService.findAuthorById(
        authorId,
      );
      return res.status(200).json({
        data: response,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get('getAuthors')
  async findAuthorByName(
    @Query('authorName') authorName: string,
    @Res() res: Response,
  ) {
    try {
      const response: IAuthor[] = await this.authorService.findAuthorsByOption({
        name: authorName,
      });
      return res.status(200).json({
        data: response,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
