import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostsService } from './posts.service';
import {PostMD} from './models/post.model';


@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: PostMD) {
    return this.postsService.create(createPostDto);
  }

  @Post('addTags')
  addTags(@Body() objectTagPost: any) {
    return this.postsService.addTags(objectTagPost);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.postsService.findOne(id);
  // }

  @Post(':id')
  findByUserOne(@Param('id') id: string,@Body() obj: any) {
    return this.postsService.findOne(id,obj);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: PostMD) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
