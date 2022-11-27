import { Controller, Get, Post, Body, Put, Param, Delete, Patch } from '@nestjs/common';
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

  @Get('user/:userId')
  findAllByUser(@Param('userId') userId: string) {
    return this.postsService.findAllByUser(userId);
  }

  @Get(':category/:topic')
  findAll(@Param('category') category: string, @Param('topic') topic: string) {
    return this.postsService.findAll(category, topic);
  }

  @Post('filterTags/:category/:topic')
  findAllWithTags(@Param('category') category: string, @Param('topic') topic: string,@Body() objectTagPost: any) {
    return this.postsService.findAllWithTags(category, topic,objectTagPost);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':postId')
  updatePost(@Param('postId') postId: string, @Body() post: any) {
    return this.postsService.updatePost(postId, post);
  }

  @Delete(':postId')
  deletePost(@Param('postId') postId: string) {
    return this.postsService.deletePost(postId);
  }
}
