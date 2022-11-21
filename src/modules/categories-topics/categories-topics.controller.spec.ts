import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesTopicsController } from './categories-topics.controller';
import { CategoriesTopicsService } from './categories-topics.service';

describe('CategoriesTopicsController', () => {
  let controller: CategoriesTopicsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesTopicsController],
      providers: [CategoriesTopicsService],
    }).compile();

    controller = module.get<CategoriesTopicsController>(CategoriesTopicsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
