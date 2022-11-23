import { Module } from '@nestjs/common';
import { CategoriesTopicsService } from './categories-topics.service';
import { CategoriesTopicsController } from './categories-topics.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryTopic } from './models/categoryTopic.model';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: CategoryTopic.modelName, schema: CategoryTopic.model.schema },
    ]),
  ],
  controllers: [CategoriesTopicsController],
  providers: [CategoriesTopicsService]
})
export class CategoriesTopicsModule {}
