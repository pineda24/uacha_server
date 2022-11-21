import { Module } from '@nestjs/common';
import { CategoriesTopicsService } from './categories-topics.service';
import { CategoriesTopicsController } from './categories-topics.controller';

@Module({
  controllers: [CategoriesTopicsController],
  providers: [CategoriesTopicsService]
})
export class CategoriesTopicsModule {}
