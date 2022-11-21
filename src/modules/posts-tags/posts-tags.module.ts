import { Module } from '@nestjs/common';
import { PostsTagsService } from './posts-tags.service';
import { PostsTagsController } from './posts-tags.controller';

@Module({
  controllers: [PostsTagsController],
  providers: [PostsTagsService]
})
export class PostsTagsModule {}
