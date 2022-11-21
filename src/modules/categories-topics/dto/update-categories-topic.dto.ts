import { PartialType } from '@nestjs/swagger';
import { CreateCategoriesTopicDto } from './create-categories-topic.dto';

export class UpdateCategoriesTopicDto extends PartialType(CreateCategoriesTopicDto) {}
