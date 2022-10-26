import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import {
  CreateCategoryDto,
  CreateCategoryResponseDto,
} from 'src/api/category/dtos/addCategoryDtos';
import {
  UpdateCategoryDto,
  UpdateCategoryResponseDto,
} from 'src/api/category/dtos/updateCategoryDtos';
import { CategoryService } from './category.service';
import { ICategory, ICategoryName } from './interfaces';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @Res() res: Response,
  ) {
    try {
      const categories: Array<string> =
        await this.categoryService.getCategoryNames();
      if (categories.includes(createCategoryDto.name)) {
        throw new ConflictException();
      }
      const response: CreateCategoryResponseDto =
        await this.categoryService.createCategory(createCategoryDto);
      return res.status(201).json({
        response,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Patch('update/:categoryId')
  async updateCategory(
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Res() res: Response,
  ) {
    try {
      const categories: Array<string> =
        await this.categoryService.getCategoryNames();
      if (categories.includes(updateCategoryDto.name)) {
        throw new ConflictException();
      }
      const response: UpdateCategoryResponseDto =
        await this.categoryService.updateCategory(
          updateCategoryDto,
          categoryId,
        );
      return res.status(200).json({
        data: response,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Delete('delete/:categoryId')
  async deleteCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Res() res: Response,
  ) {
    try {
      const response = await this.categoryService.deleteCategory(categoryId);
      return res.status(200).json({
        data: response,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get('categories')
  async getCategories(@Res() res: Response) {
    try {
      const response: ICategory[] = await this.categoryService.getCategories();
      return res.status(200).json({
        data: response,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get('names')
  async getCategoryNames(@Res() res: Response) {
    try {
      const response: Array<string> =
        await this.categoryService.getCategoryNames();
      return res.status(200).json({
        data: response,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get('categoryByName/:categoryName')
  async getCategoryByName(
    @Param('categoryName') categoryName: string,
    @Res() res: Response,
  ) {
    try {
      const response = await this.categoryService.getCategoryByOption({
        name: categoryName,
      });
      return res.status(200).json({
        data: response,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
