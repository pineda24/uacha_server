import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesTopicsService } from './categories-topics.service';

describe('CategoriesTopicsService', () => {
  let service: CategoriesTopicsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriesTopicsService],
    }).compile();

    service = module.get<CategoriesTopicsService>(CategoriesTopicsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
