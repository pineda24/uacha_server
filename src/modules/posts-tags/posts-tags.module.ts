import { Module } from '@nestjs/common';
import { PostsTagsService } from './posts-tags.service';
import { PostsTagsController } from './posts-tags.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostTag } from './models/postTag.model';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: PostTag.modelName, schema: PostTag.model.schema },
    ]),
  ],
  controllers: [PostsTagsController],
  providers: [PostsTagsService]
})
export class PostsTagsModule {}
