import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostMD } from './models/post.model';
import { Tag } from '../tags/models/tag.model';
import { CommentsModule } from '../comments/comments.module';
import { User } from '../users/models/users.model';
import { TagsModule } from '../tags/tags.module';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: PostMD.modelName, schema: PostMD.model.schema },
    ]),
    MongooseModule.forFeature([
      { name: Tag.modelName, schema: Tag.model.schema },
    ]),
    MongooseModule.forFeature([
      { name: User.modelName, schema: User.model.schema },
    ]),
    CommentsModule,
    TagsModule
  ],
  controllers: [PostsController],
  providers: [PostsService],
  // exports: [PostsService],
})
export class PostsModule {}
