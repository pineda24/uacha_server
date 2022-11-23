import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post } from './models/post.model';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: Post.modelName, schema: Post.model.schema },
    ]),
  ],
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {}
