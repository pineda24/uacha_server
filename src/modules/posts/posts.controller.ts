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

  // VOTES UP

  @Post('addVotesUp')
  addVotesUp(@Body() objectUserPost: any) {
    return this.postsService.addVotesUp(objectUserPost);
  }

  @Post('removeVotesUp')
  removeVotesUp(@Body() objectUserPost: any) {
    return this.postsService.removeVotesUp(objectUserPost);
  }

  // VOTES DOWN

  @Post('addDownVotes')
  addDownVotes(@Body() objectTagPost: any) {
    return this.postsService.addDownVotes(objectTagPost);
  }

  @Post('removeDownVotes')
  removeDownVotes(@Body() objectTagPost: any) {
    return this.postsService.removeDownVotes(objectTagPost);
  }

  @Get(':category/:topic')
  findAll(@Param('category') category: string, @Param('topic') topic: string) {
    return this.postsService.findAll(category, topic);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Post(':id')
  findByUserOne(@Param('id') id: string, @Body() obj: any) {
    return this.postsService.findByUserOne(id, obj);
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
