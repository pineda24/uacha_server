import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category } from './models/category.model';
import { PostMD } from '../posts/models/post.model';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: Category.modelName, schema: Category.model.schema },
    ]),
    MongooseModule.forFeature([
      { name: PostMD.modelName, schema: PostMD.model.schema },
    ]),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService]
})
export class CategoriesModule {}
