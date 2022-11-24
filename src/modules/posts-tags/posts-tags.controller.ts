import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostsTagsService } from './posts-tags.service';
import { CreatePostsTagDto } from './dto/create-posts-tag.dto';
import { UpdatePostsTagDto } from './dto/update-posts-tag.dto';
import { PostTag } from './models/postTag.model';

@Controller('posts-tags')
export class PostsTagsController {
  constructor(private readonly postsTagsService: PostsTagsService) {}

  @Post()
  create(@Body() createPostsTagDto: PostTag) {
    return this.postsTagsService.create(createPostsTagDto);
  }

  @Get()
  findAll() {
    return this.postsTagsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsTagsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostsTagDto: UpdatePostsTagDto) {
    return this.postsTagsService.update(+id, updatePostsTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsTagsService.remove(+id);
  }
}
