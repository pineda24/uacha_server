import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from './schemas/post.schema';
import { TagSchema } from '../tags/schemas/tag.schema';
import { CommentSchema } from '../comments/schemas/comment.schema';
import { UserSchema } from '../users/schemas/user.schema';
import { TagsService } from '../tags/tags.service';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: 'Post', schema: PostSchema },
    ]),
    MongooseModule.forFeature([
      { name: 'Comment', schema: CommentSchema },
    ]),
    MongooseModule.forFeature([
      { name: 'Tag', schema: TagSchema },
    ]),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
    ])
  ],
  controllers: [PostsController],
  providers: [PostsService, TagsService],
})
export class PostsModule {}
