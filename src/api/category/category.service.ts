import {
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repositoties } from 'src/utils/constants';
import {
  CreateCategoryDto,
  CreateCategoryResponseDto,
} from './dtos/addCategoryDtos';
import { Repository } from 'typeorm';
import { Category } from './entities';
import { ICategory, ICategoryName } from './interfaces';
import {
  UpdateCategoryDto,
  UpdateCategoryResponseDto,
} from './dtos/updateCategoryDtos';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(Repositoties.CATEGORY)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  public async createCategory(
    dto: CreateCategoryDto,
  ): Promise<CreateCategoryResponseDto> {
    const category = new Category();
    category.name = dto.name;

    dto.description.length > 0
      ? (category.description = dto.description)
      : (category.description = null);

    const response = await this.categoryRepository
      .createQueryBuilder()
      .insert()
      .into(Category)
      .values(category)
      .execute();
    return {
      message: 'Success',
      affectedRow: response.identifiers[0].id,
    };
  }

  public async updateCategory(
    dto: UpdateCategoryDto,
    categoryId: number,
  ): Promise<UpdateCategoryResponseDto> {
    const response = await this.categoryRepository
      .createQueryBuilder('category')
      .update(Category)
      .set(dto)
      .where('category.id = :categoryId', { categoryId: categoryId })
      .execute();
    return {
      message: 'Success',
      affectedRow: response.affected,
    };
  }

  public async deleteCategory(categoryId: number) {
    const response = await this.categoryRepository
      .createQueryBuilder('category')
      .delete()
      .from(Category)
      .where('category.id = :categoryId', { categoryId: categoryId })
      .execute();
    if (response.affected === 0)
      return {
        message: 'failed',
        data: response.affected,
      };
    return {
      message: 'Success',
      data: response.affected,
    };
  }

  public async getCategories(): Promise<ICategory[]> {
    const response: ICategory[] = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.book','book')
      .getMany();
    return response;
  }

  public async getCategoryNames(): Promise<Array<string>> {
    let namesArray: Array<string> = [];
    const response: ICategoryName[] = await this.categoryRepository
      .createQueryBuilder('category')
      .select(['name'])
      .getRawMany();
    for (let item of response) {
      namesArray.push(item.name);
    }
    return namesArray;
  }

  public async getCategoryByOption(option: object): Promise<ICategory[]> {
    const response: ICategory[] = await this.categoryRepository
      .createQueryBuilder()
      .where(option)
      .getMany();

    return response;
  }
}
