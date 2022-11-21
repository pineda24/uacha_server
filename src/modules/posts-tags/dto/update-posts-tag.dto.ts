import { PartialType } from '@nestjs/swagger';
import { CreatePostsTagDto } from './create-posts-tag.dto';

export class UpdatePostsTagDto extends PartialType(CreatePostsTagDto) {}
