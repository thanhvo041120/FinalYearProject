import { ConflictException, HttpStatus, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Repositoties } from 'src/utils/constants';
import { CreateCategoryDto } from 'src/utils/dtos/categories/addCategoryDtos';
import { UpdateCategoryDto } from 'src/utils/dtos/categories/updateCategoryDtos';
import { Repository } from 'typeorm';
import { Category } from './entities';
import { ICategory, ICategoryName } from './interfaces';

@Injectable()
export class CategoryService {
    constructor(
        @Inject(Repositoties.CATEGORY)
        private readonly categoryRepository: Repository<Category>,
    ){}

    public async createCategory(dto: CreateCategoryDto): Promise<object>{
        try {
            const category= new Category();
            category.name = dto.name;

            if(dto.description.length > 0) category.description = dto.description;

            category.description = null;
            const response = await this.categoryRepository.createQueryBuilder()
            .insert()
            .into(Category)
            .values([category])
            .execute();

            if(!response) return {
                message: 'failed',
                data: 0,
                status: HttpStatus.CONFLICT
            }

            return {
                message: 'success',
                data: response.identifiers[0].id,
                status: HttpStatus.CREATED,
            }
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    public async getCategories(): Promise<object>{
        try {
            const response: ICategory[] = await this.categoryRepository.createQueryBuilder('category')
            .getMany();

            if(!response) return {
                message: 'failed',
                data: 0,
                status: HttpStatus.NOT_FOUND,
            }

            return {
                message: 'success',
                data: response,
                status: HttpStatus.OK,
            }
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    public async getCategoryNames(): Promise<object>{
        try {
            let categoryNamesArray: Array<string> = [];
            const response: ICategoryName[] = await this.categoryRepository.createQueryBuilder('category')
            .select(['category.name'])
            .getRawMany()

            if(!response) return {
                message: 'failed',
                data: 0,
                status:HttpStatus.NOT_FOUND,
            }

            for (let item of response){                
                categoryNamesArray.push(item['category_name']);
            }


            return {
                message: 'success',
                data: categoryNamesArray,
                status: HttpStatus.OK,
            }
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    public async getCategoryByName(categoryName: string){
        try {
            const response:ICategory = await this.categoryRepository.createQueryBuilder('category')
            .where('category.name = :categoryName', {categoryName: categoryName})
            .getOne();
            if(!response) return  {
                message: 'failed',
                data: 0,
                HttpStatus: HttpStatus.NOT_FOUND
            };
            return {
                message: 'success',
                data: response,
                status: HttpStatus.OK
            }
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    public async updateCategory(dto: UpdateCategoryDto, categoryId: number):Promise<object>{
        try {
            const response = await this.categoryRepository.createQueryBuilder('category')
            .update(Category)
            .set(dto)
            .where('category.id = :categoryId', {categoryId: categoryId})
            .execute();
            if(response.affected === 0 ) return  {
                message: 'failed',
                data: response.affected,
                HttpStatus: HttpStatus.NOT_FOUND
            };
            return{
                message: 'success',
                data: response.affected,
                status: HttpStatus.OK
            }
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    public async deleteCategory(categoryId: number){
        try {
            const response = await this.categoryRepository.createQueryBuilder('category')
            .delete()
            .from(Category)
            .where('category.id = :categoryId',{categoryId: categoryId})
            .execute();
            if(response.affected === 0) return {
                message: 'failed',
                data: response.affected,
                HttpStatus: HttpStatus.NOT_FOUND
            }
            return{
                message: 'success',
                data: response.affected,
                status: HttpStatus.OK
            }
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }
}
