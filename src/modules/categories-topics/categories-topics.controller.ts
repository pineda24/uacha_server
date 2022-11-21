import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoriesTopicsService } from './categories-topics.service';
import { CreateCategoriesTopicDto } from './dto/create-categories-topic.dto';
import { UpdateCategoriesTopicDto } from './dto/update-categories-topic.dto';

@Controller('categories-topics')
export class CategoriesTopicsController {
  constructor(private readonly categoriesTopicsService: CategoriesTopicsService) {}

  @Post()
  create(@Body() createCategoriesTopicDto: CreateCategoriesTopicDto) {
    return this.categoriesTopicsService.create(createCategoriesTopicDto);
  }

  @Get()
  findAll() {
    return this.categoriesTopicsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesTopicsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoriesTopicDto: UpdateCategoriesTopicDto) {
    return this.categoriesTopicsService.update(+id, updateCategoriesTopicDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesTopicsService.remove(+id);
  }
}
