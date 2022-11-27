import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './models/comment.model';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() createCommentDto: Comment) {
    return this.commentsService.create(createCommentDto);
  }

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @Post('addComment')
  addTags(@Body() objectTagPost: any) {
    return this.commentsService.addComment(objectTagPost);
  }

  // VOTES UP

  @Post('addVotesUp')
  addVotesUp(@Body() objectTagPost: any) {
    return this.commentsService.addVotesUp(objectTagPost);
  }

  @Post('removeVotesUp')
  removeVotesUp(@Body() objectTagPost: any) {
    return this.commentsService.removeVotesUp(objectTagPost);
  }

  // VOTES DOWN

  @Post('addDownVotes')
  addDownVotes(@Body() objectTagPost: any) {
    return this.commentsService.addDownVotes(objectTagPost);
  }

  @Post('removeDownVotes')
  removeDownVotes(@Body() objectTagPost: any) {
    return this.commentsService.removeDownVotes(objectTagPost);
  }

  @Get('findByPostId/:id')
  findByPostId(@Param('id') id: string) {
    return this.commentsService.findByPostId(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }
}
