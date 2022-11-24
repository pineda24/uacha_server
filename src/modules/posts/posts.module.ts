import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostMD } from './models/post.model';
import { Tag } from '../tags/models/tag.model';
import { CommentsModule } from '../comments/comments.module';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: PostMD.modelName, schema: PostMD.model.schema },
    ]),
    MongooseModule.forFeature([
      { name: Tag.modelName, schema: Tag.model.schema },
    ]),
    CommentsModule
  ],
  controllers: [PostsController],
  providers: [PostsService],
  // exports: [PostsService],
})
export class PostsModule {}
