import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/api/database/database.module';
import { CategoryController } from './category.controller';
import { categoryProviders } from './category.provider';
import { CategoryService } from './category.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoryController],
  providers: [CategoryService, ...categoryProviders],
  exports: [CategoryService]
})
export class CategoryModule {}
