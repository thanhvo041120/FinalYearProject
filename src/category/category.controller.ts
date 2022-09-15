import { BadRequestException, Body, ConflictException, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto } from 'src/utils/dtos/categories/addCategoryDtos';
import { UpdateCategoryDto } from 'src/utils/dtos/categories/updateCategoryDtos';
import { CategoryService } from './category.service';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService
    ){}

    @Post('create')
    async createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<object>{
        const categories: object = await this.categoryService.getCategoryNames();
        if(categories['data'] === 0) return this.categoryService.createCategory(createCategoryDto);
        
        if(categories['data'].includes(createCategoryDto.name)) return new ConflictException('Existed');
        
        return this.categoryService.createCategory(createCategoryDto);
    }

    @Get('categories')
    getCategories(){
        return this.categoryService.getCategories();
    }

    @Get('categories/name')
    getCategoryNames(){
        return this.categoryService.getCategoryNames();
    }

    @Get('categoryByName/:categoryName')
    getCategoryByName(@Param('categoryName') categoryName: string){
        return this.categoryService.getCategoryByName(categoryName);
    }

    @Patch('update/:categoryId')
    updateCategory(@Body() updateCategoryDto: UpdateCategoryDto, @Param('categoryId', ParseIntPipe) categoryId: number){
        if(updateCategoryDto.name.length ===0 && updateCategoryDto.description.length === 0) return new BadRequestException()
        return this.categoryService.updateCategory(updateCategoryDto, categoryId);
    }

    @Delete('delete/:categoryId')
    deleteCategory(@Param('categoryId', ParseIntPipe) categoryId: number){
        return this.categoryService.deleteCategory(categoryId);
    }
}
