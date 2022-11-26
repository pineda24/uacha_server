import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './models/category.model';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: Category) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Post('addTopic')
  addTags(@Body() objectCategorieTopic: any) {
    return this.categoriesService.addTopic(objectCategorieTopic);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get('findAllWithTopics')
  findAllWithTopics() {
    return this.categoriesService.findAllWithTopics();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
